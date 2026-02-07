import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // ----------------------  Access Control  ----------------------
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ----------------------  Storage  ----------------------
  include MixinStorage();

  public type PaymentMode = {
    #phonePe;
    #gPay;
    #upi;
    #cash;
    #cheque;
  };

  public type PaymentStatus = {
    #pendingVerification;
    #approved;
    #rejected;
  };

  public type PaymentConfirmation = {
    id : Nat;
    donorName : Text;
    mobileNumber : Text;
    amountPaid : Nat;
    paymentMode : PaymentMode;
    transactionId : Text;
    date : Time.Time;
    status : PaymentStatus;
    verificationDate : ?Time.Time;
  };

  public type Receipt = {
    receiptNumber : Nat;
    templeName : Text;
    date : Time.Time;
    donorName : Text;
    amount : Nat;
    paymentMode : PaymentMode;
    transactionId : Text;
    receiver : Text;
    location : Text;
    isCancelled : Bool;
  };

  public type CommitteeRole = {
    #president;
    #secretary;
    #member;
  };

  public type CommitteeMember = {
    id : Nat;
    name : Text;
    role : CommitteeRole;
    mobileNumber : Text;
  };

  public type CommitteeMemberPublic = {
    id : Nat;
    name : Text;
    role : CommitteeRole;
  };

  public type Jatre = {
    id : Nat;
    name : Text;
    date : Time.Time;
    description : Text;
    activities : [Text];
  };

  public type TempleContact = {
    id : Nat;
    contactType : Text;
    contactNumber : Text;
  };

  public type GalleryItem = {
    id : Nat;
    title : Text;
    description : Text;
    mediaType : Text;
    externalBlob : Storage.ExternalBlob;
  };

  public type DonationReport = {
    totalAmount : Nat;
    totalCollections : Nat;
  };

  public type DonorDetail = {
    donorName : Text;
    amount : Nat;
    date : Time.Time;
    paymentMode : PaymentMode;
    transactionId : Text;
  };

  public type TempleAccount = {
    balance : Nat;
    lastUpdated : Time.Time;
  };

  let paymentConfirmations = Map.empty<Nat, PaymentConfirmation>();
  let receipts = Map.empty<Nat, Receipt>();
  let committeeMembers = Map.empty<Nat, CommitteeMember>();
  let jatres = Map.empty<Nat, Jatre>();
  let templeContacts = Map.empty<Nat, TempleContact>();
  let gallery = Map.empty<Nat, GalleryItem>();

  var nextPaymentId = 1;
  var nextReceiptNumber = 1;
  var nextCommitteeMemberId = 1;
  var nextJatreId = 1;
  var nextContactId = 1;
  var nextGalleryItemId = 1;

  var templeAccount : TempleAccount = {
    balance = 0;
    lastUpdated = Time.now();
  };

  // ----------------------  Payment Confirmation  ----------------------

  public shared ({ caller }) func submitPaymentConfirmation(donorName : Text, mobileNumber : Text, amountPaid : Nat, paymentMode : PaymentMode, transactionId : Text, date : Time.Time) : async Nat {
    let paymentId = nextPaymentId;
    nextPaymentId += 1;

    let paymentConfirmation : PaymentConfirmation = {
      id = paymentId;
      donorName;
      mobileNumber;
      amountPaid;
      paymentMode;
      transactionId;
      date;
      status = #pendingVerification;
      verificationDate = null;
    };

    paymentConfirmations.add(paymentId, paymentConfirmation);
    paymentId;
  };

  // ----------------------  Admin Payment Approval  ----------------------

  module PaymentConfirmation {
    public func compare(a : PaymentConfirmation, b : PaymentConfirmation) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public query ({ caller }) func getPendingPayments() : async [PaymentConfirmation] {
    checkAdmin(caller);
    paymentConfirmations.values().toArray().filter(func(p) { p.status == #pendingVerification }).sort();
  };

  public shared ({ caller }) func editPaymentConfirmation(paymentId : Nat, donorName : Text, mobileNumber : Text, amountPaid : Nat, paymentMode : PaymentMode, transactionId : Text, date : Time.Time) : async () {
    checkAdmin(caller);
    switch (paymentConfirmations.get(paymentId)) {
      case (?payment) {
        if (payment.status != #pendingVerification) {
          Runtime.trap("Can only edit payments that are pending verification");
        };

        let updatedPayment : PaymentConfirmation = {
          id = paymentId;
          donorName;
          mobileNumber;
          amountPaid;
          paymentMode;
          transactionId;
          date;
          status = #pendingVerification;
          verificationDate = null;
        };

        paymentConfirmations.add(paymentId, updatedPayment);
      };
      case (null) { Runtime.trap("Payment not found") };
    };
  };

  public shared ({ caller }) func approvePayment(paymentId : Nat) : async () {
    checkAdmin(caller);
    switch (paymentConfirmations.get(paymentId)) {
      case (?payment) {
        if (payment.status != #pendingVerification) {
          Runtime.trap("Payment is not pending verification");
        };

        let updatedPayment = {
          payment with
          status = #approved;
          verificationDate = ?Time.now();
        };

        paymentConfirmations.add(paymentId, updatedPayment);

        templeAccount := {
          balance = templeAccount.balance + payment.amountPaid;
          lastUpdated = Time.now();
        };

        let receipt : Receipt = {
          receiptNumber = nextReceiptNumber;
          templeName = "Shree Doddamma Devi Temple";
          date = Time.now();
          donorName = payment.donorName;
          amount = payment.amountPaid;
          paymentMode = payment.paymentMode;
          transactionId = payment.transactionId;
          receiver = "Ravi Kumar V C – President";
          location = "Bommenahalli Vaddarahatti";
          isCancelled = false;
        };

        receipts.add(nextReceiptNumber, receipt);
        nextReceiptNumber += 1;
      };
      case (null) { Runtime.trap("Payment not found") };
    };
  };

  public shared ({ caller }) func rejectPayment(paymentId : Nat) : async () {
    checkAdmin(caller);
    switch (paymentConfirmations.get(paymentId)) {
      case (?payment) {
        if (payment.status != #pendingVerification) {
          Runtime.trap("Payment is not pending verification");
        };

        let updatedPayment = {
          payment with
          status = #rejected;
          verificationDate = ?Time.now();
        };

        paymentConfirmations.add(paymentId, updatedPayment);
      };
      case (null) { Runtime.trap("Payment not found") };
    };
  };

  // ----------------------  Temple Account Balance  ----------------------

  public query ({ caller }) func getTempleAccountBalance() : async TempleAccount {
    checkAdmin(caller);
    templeAccount;
  };

  public shared ({ caller }) func adminAdjustBalance(newBalance : Nat) : async () {
    checkAdmin(caller);
    templeAccount := {
      balance = newBalance;
      lastUpdated = Time.now();
    };
  };

  // ----------------------  Receipts Management  ----------------------

  public query ({ caller }) func getReceipt(receiptNumber : Nat) : async Receipt {
    getReceiptInternal(receiptNumber);
  };

  public shared ({ caller }) func regenerateReceipt(receiptNumber : Nat) : async Receipt {
    checkAdmin(caller);
    let receipt = getReceiptInternal(receiptNumber);
    if (receipt.isCancelled) {
      Runtime.trap("Cannot regenerate a cancelled receipt");
    };
    receipt;
  };

  public shared ({ caller }) func cancelReceipt(receiptNumber : Nat) : async () {
    checkAdmin(caller);
    switch (receipts.get(receiptNumber)) {
      case (?receipt) {
        let updatedReceipt = { receipt with isCancelled = true };
        receipts.add(receiptNumber, updatedReceipt);
      };
      case (null) { Runtime.trap("Receipt not found") };
    };
  };

  func getReceiptInternal(receiptNumber : Nat) : Receipt {
    switch (receipts.get(receiptNumber)) {
      case (?receipt) { receipt };
      case (null) { Runtime.trap("Receipt not found") };
    };
  };

  // ----------------------  Donation Reporting  ----------------------

  public query ({ caller }) func getDonorList() : async [DonorDetail] {
    checkAdmin(caller);
    let approvedPayments = paymentConfirmations.values().toArray().filter(func(p) { p.status == #approved });
    approvedPayments.map<PaymentConfirmation, DonorDetail>(
      func(p) {
        {
          donorName = p.donorName;
          amount = p.amountPaid;
          date = p.date;
          paymentMode = p.paymentMode;
          transactionId = p.transactionId;
        };
      },
    );
  };

  public query ({ caller }) func getDonationReport() : async DonationReport {
    let approvedPayments = paymentConfirmations.values().toArray().filter(func(p) { p.status == #approved });
    var totalAmount = 0;
    for (payment in approvedPayments.vals()) {
      totalAmount += payment.amountPaid;
    };
    {
      totalAmount = totalAmount;
      totalCollections = approvedPayments.size();
    };
  };

  // ----------------------  Committee Management  ----------------------

  public shared ({ caller }) func addCommitteeMember(name : Text, role : CommitteeRole, mobileNumber : Text) : async Nat {
    checkAdmin(caller);
    let memberId = nextCommitteeMemberId;
    nextCommitteeMemberId += 1;

    let committeeMember : CommitteeMember = {
      id = memberId;
      name;
      role;
      mobileNumber;
    };

    committeeMembers.add(memberId, committeeMember);
    memberId;
  };

  public shared ({ caller }) func editCommitteeMember(memberId : Nat, name : Text, role : CommitteeRole, mobileNumber : Text) : async () {
    checkAdmin(caller);
    switch (committeeMembers.get(memberId)) {
      case (?_) {
        let updatedMember : CommitteeMember = {
          id = memberId;
          name;
          role;
          mobileNumber;
        };
        committeeMembers.add(memberId, updatedMember);
      };
      case (null) { Runtime.trap("Committee member not found") };
    };
  };

  public shared ({ caller }) func removeCommitteeMember(memberId : Nat) : async () {
    checkAdmin(caller);
    committeeMembers.remove(memberId);
  };

  public query ({ caller }) func getCommitteeMembers() : async [CommitteeMemberPublic] {
    let members = committeeMembers.values().toArray();
    members.map<CommitteeMember, CommitteeMemberPublic>(
      func(m) {
        {
          id = m.id;
          name = m.name;
          role = m.role;
        };
      },
    );
  };

  public query ({ caller }) func getCommitteeMembersAdmin() : async [CommitteeMember] {
    checkAdmin(caller);
    committeeMembers.values().toArray();
  };

  // ----------------------  Jatre Management  ----------------------

  public shared ({ caller }) func addJatre(name : Text, date : Time.Time, description : Text, activities : [Text]) : async Nat {
    checkAdmin(caller);
    let jatreId = nextJatreId;
    nextJatreId += 1;

    let jatre : Jatre = {
      id = jatreId;
      name;
      date;
      description;
      activities;
    };

    jatres.add(jatreId, jatre);
    jatreId;
  };

  public shared ({ caller }) func editJatre(jatreId : Nat, name : Text, date : Time.Time, description : Text, activities : [Text]) : async () {
    checkAdmin(caller);
    switch (jatres.get(jatreId)) {
      case (?_) {
        let updatedJatre : Jatre = {
          id = jatreId;
          name;
          date;
          description;
          activities;
        };
        jatres.add(jatreId, updatedJatre);
      };
      case (null) { Runtime.trap("Jatre not found") };
    };
  };

  public shared ({ caller }) func removeJatre(jatreId : Nat) : async () {
    checkAdmin(caller);
    jatres.remove(jatreId);
  };

  public query ({ caller }) func getJatres() : async [Jatre] {
    jatres.values().toArray();
  };

  // ----------------------  Temple Contacts Management  ----------------------

  public shared ({ caller }) func addContact(contactType : Text, contactNumber : Text) : async Nat {
    checkAdmin(caller);
    let contactId = nextContactId;
    nextContactId += 1;

    let contact : TempleContact = {
      id = contactId;
      contactType;
      contactNumber;
    };

    templeContacts.add(contactId, contact);
    contactId;
  };

  public shared ({ caller }) func editContact(contactId : Nat, contactType : Text, contactNumber : Text) : async () {
    checkAdmin(caller);
    switch (templeContacts.get(contactId)) {
      case (?_) {
        let updatedContact : TempleContact = {
          id = contactId;
          contactType;
          contactNumber;
        };
        templeContacts.add(contactId, updatedContact);
      };
      case (null) { Runtime.trap("Contact not found") };
    };
  };

  public shared ({ caller }) func removeContact(contactId : Nat) : async () {
    checkAdmin(caller);
    templeContacts.remove(contactId);
  };

  public query ({ caller }) func getContacts() : async [TempleContact] {
    templeContacts.values().toArray();
  };

  // ----------------------  Gallery Management  ----------------------

  public shared ({ caller }) func addGalleryItem(title : Text, description : Text, mediaType : Text, externalBlob : Storage.ExternalBlob) : async Nat {
    checkAdmin(caller);
    let itemId = nextGalleryItemId;
    nextGalleryItemId += 1;

    let galleryItem : GalleryItem = {
      id = itemId;
      title;
      description;
      mediaType;
      externalBlob;
    };

    gallery.add(itemId, galleryItem);
    itemId;
  };

  public shared ({ caller }) func editGalleryItem(itemId : Nat, title : Text, description : Text, mediaType : Text) : async () {
    checkAdmin(caller);
    switch (gallery.get(itemId)) {
      case (?item) {
        let updatedItem = {
          item with
          title;
          description;
          mediaType;
        };
        gallery.add(itemId, updatedItem);
      };
      case (null) { Runtime.trap("Gallery item not found") };
    };
  };

  public shared ({ caller }) func removeGalleryItem(itemId : Nat) : async () {
    checkAdmin(caller);
    gallery.remove(itemId);
  };

  public query ({ caller }) func getGalleryItems() : async [GalleryItem] {
    gallery.values().toArray();
  };

  // ----------------------  Helper Functions  ----------------------

  func checkAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
