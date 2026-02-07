import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  PaymentMode,
  PaymentConfirmation,
  TempleAccount,
  Receipt,
  DonationReport,
  DonorDetail,
  CommitteeMemberPublic,
  CommitteeMember,
  CommitteeRole,
  Jatre,
  TempleContact,
  GalleryItem,
} from '../backend';
import { ExternalBlob } from '../backend';

export function useSubmitPaymentConfirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      donorName: string;
      mobileNumber: string;
      amountPaid: bigint;
      paymentMode: PaymentMode;
      transactionId: string;
      date: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPaymentConfirmation(
        data.donorName,
        data.mobileNumber,
        data.amountPaid,
        data.paymentMode,
        data.transactionId,
        data.date
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
    },
  });
}

export function useGetPendingPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentConfirmation[]>({
    queryKey: ['pendingPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEditPaymentConfirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      paymentId: bigint;
      donorName: string;
      mobileNumber: string;
      amountPaid: bigint;
      paymentMode: PaymentMode;
      transactionId: string;
      date: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editPaymentConfirmation(
        data.paymentId,
        data.donorName,
        data.mobileNumber,
        data.amountPaid,
        data.paymentMode,
        data.transactionId,
        data.date
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
    },
  });
}

export function useApprovePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approvePayment(paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['templeBalance'] });
      queryClient.invalidateQueries({ queryKey: ['donationReport'] });
      queryClient.invalidateQueries({ queryKey: ['donorList'] });
    },
  });
}

export function useRejectPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectPayment(paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
    },
  });
}

export function useGetTempleAccountBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<TempleAccount>({
    queryKey: ['templeBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTempleAccountBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReceipt(receiptNumber: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Receipt>({
    queryKey: ['receipt', receiptNumber?.toString()],
    queryFn: async () => {
      if (!actor || !receiptNumber) throw new Error('Actor or receipt number not available');
      return actor.getReceipt(receiptNumber);
    },
    enabled: !!actor && !isFetching && receiptNumber !== null,
  });
}

export function useRegenerateReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiptNumber: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.regenerateReceipt(receiptNumber);
    },
    onSuccess: (_, receiptNumber) => {
      queryClient.invalidateQueries({ queryKey: ['receipt', receiptNumber.toString()] });
    },
  });
}

export function useCancelReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiptNumber: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelReceipt(receiptNumber);
    },
    onSuccess: (_, receiptNumber) => {
      queryClient.invalidateQueries({ queryKey: ['receipt', receiptNumber.toString()] });
    },
  });
}

export function useGetDonationReport() {
  const { actor, isFetching } = useActor();

  return useQuery<DonationReport>({
    queryKey: ['donationReport'],
    queryFn: async () => {
      if (!actor) return { totalAmount: BigInt(0), totalCollections: BigInt(0) };
      return actor.getDonationReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDonorList() {
  const { actor, isFetching } = useActor();

  return useQuery<DonorDetail[]>({
    queryKey: ['donorList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDonorList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommitteeMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<CommitteeMemberPublic[]>({
    queryKey: ['committeeMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommitteeMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommitteeMembersAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<CommitteeMember[]>({
    queryKey: ['committeeMembersAdmin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommitteeMembersAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCommitteeMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; role: CommitteeRole; mobileNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCommitteeMember(data.name, data.role, data.mobileNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers'] });
      queryClient.invalidateQueries({ queryKey: ['committeeMembersAdmin'] });
    },
  });
}

export function useEditCommitteeMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      memberId: bigint;
      name: string;
      role: CommitteeRole;
      mobileNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editCommitteeMember(data.memberId, data.name, data.role, data.mobileNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers'] });
      queryClient.invalidateQueries({ queryKey: ['committeeMembersAdmin'] });
    },
  });
}

export function useRemoveCommitteeMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeCommitteeMember(memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers'] });
      queryClient.invalidateQueries({ queryKey: ['committeeMembersAdmin'] });
    },
  });
}

export function useGetJatres() {
  const { actor, isFetching } = useActor();

  return useQuery<Jatre[]>({
    queryKey: ['jatres'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJatres();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJatre() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      date: bigint;
      description: string;
      activities: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJatre(data.name, data.date, data.description, data.activities);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jatres'] });
    },
  });
}

export function useEditJatre() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jatreId: bigint;
      name: string;
      date: bigint;
      description: string;
      activities: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editJatre(data.jatreId, data.name, data.date, data.description, data.activities);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jatres'] });
    },
  });
}

export function useRemoveJatre() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jatreId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeJatre(jatreId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jatres'] });
    },
  });
}

export function useGetContacts() {
  const { actor, isFetching } = useActor();

  return useQuery<TempleContact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { contactType: string; contactNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContact(data.contactType, data.contactNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useEditContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { contactId: bigint; contactType: string; contactNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editContact(data.contactId, data.contactType, data.contactNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useRemoveContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeContact(contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useGetGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      mediaType: string;
      externalBlob: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryItem(data.title, data.description, data.mediaType, data.externalBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

export function useEditGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      itemId: bigint;
      title: string;
      description: string;
      mediaType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editGalleryItem(data.itemId, data.title, data.description, data.mediaType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

export function useRemoveGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeGalleryItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}
