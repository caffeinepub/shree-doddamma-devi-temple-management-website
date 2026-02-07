# Specification

## Summary
**Goal:** Build a mobile-first public website and a secure admin portal for Shree Doddamma Devi Temple to manage donations via manual verification, generate receipts, and manage temple content (committee, festivals, contacts, gallery), with strict privacy controls.

**Planned changes:**
- Create public site pages with navigation to: Donations, Payment Confirmation, Total Collection, Committee Members, Jatre/Festivals, Gallery, Contact Numbers, and Location; show temple name + location on all public pages; headings in Kannada + English with English body text.
- Add public donation button (exact text) that opens a configurable UPI deep link and shows a post-click instruction message; include text indicating support for PhonePe, Google Pay, and any UPI app.
- Implement public Payment Confirmation Form (donor name, mobile, amount, mode, transaction ID, date) that saves submissions as “Pending verification”; prevent public browsing of submissions.
- Implement secure admin authentication via Internet Identity with backend-stored admin allowlist; enforce admin-only access to all admin routes and admin-only data/actions.
- Build admin workflows: view/edit pending payments, approve/reject; on approval update temple balance exactly once and generate an auto-numbered receipt; on rejection do not affect balance.
- Add admin Temple Account Balance dashboard (current balance + last updated timestamp); ensure balance changes only via approval workflow (and any explicit admin adjustment if present).
- Create receipt viewing and export features: downloadable PDF, printable, and shareable to WhatsApp; add admin actions to regenerate receipt export and cancel receipts with explicit UI rule about balance impact and backend enforcement.
- Implement reporting with privacy: admin can view full donor/payment list; public can view only aggregate total collection.
- Implement committee management: admin CRUD with mobile numbers; public displays name + role only.
- Implement jatre/festival management: admin CRUD; public lists and shows full details.
- Implement contact numbers management: admin sets temple and committee numbers; public displays clickable tel: links.
- Implement gallery management: admin adds photos/videos via upload and/or direct URL with validation/size limits; public browses gallery; keep data within Internet Computer constraints without external databases.
- Implement location page with embedded Google Map and a Navigate button opening directions.
- Apply a consistent devotional, peaceful, light theme with simple layout and traditional temple-style iconography (avoid default blue/purple-dominant look).

**User-visible outcome:** Visitors can browse temple information, donate via UPI, submit payment confirmation for manual verification, view total collection, and see festivals, gallery, contacts, and location; admins can securely log in to verify payments, manage balance, generate/manage receipts, and manage committee, festivals, contacts, and gallery with private data protected from the public.
