'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ImagePlus,
  MessageSquare,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'

import { useLanguage } from '@/components/language-provider'

type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Resolved'

type Complaint = {
  id: string
  category: string
  orderId: string
  description: string
  status: ComplaintStatus
  date: string
  photo?: string
}

const complaintCategories = [
  'Service Quality',
  'Late Pickup / Delivery',
  'Damaged Clothes',
  'Missing Items',
  'Payment Issue',
  'Provider Behaviour',
  'Other',
]

export function ComplaintsScreen() {
  const { language } = useLanguage()

  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('')
  const [orderId, setOrderId] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])

  const text = {
    en: {
      support: 'Cooperative Support',
      title: 'Complaints & Support',
      description:
        'Raise an issue and our cooperative support team will help resolve it fairly and transparently.',
      raise: 'Raise a Complaint',
      tellUs: 'Tell us what happened.',
      close: 'Close',
      category: 'Complaint Category',
      selectCategory: 'Select a category',
      orderId: 'Order ID',
      orderPlaceholder: 'Example: NXL-10234',
      issue: 'Describe the issue',
      issuePlaceholder:
        'Explain your issue clearly...',
      evidence: 'Photo Evidence',
      optional: 'Optional',
      upload: 'Upload a photo',
      uploadDescription:
        'Add a photo showing the issue',
      imageFormat: 'JPG, PNG • Maximum 5 MB',
      removePhoto: 'Remove photo',
      attached: 'Photo evidence attached',
      submit: 'Submit Complaint',
      myComplaints: 'My Complaints',
      complaint: 'complaint',
      complaints: 'complaints',
      noComplaints: 'No complaints yet',
      noComplaintsDescription:
        'Your submitted complaints will appear here.',
      order: 'Order',
      fairResolution: 'Fair & Transparent Resolution',
      fairDescription:
        'NeXa Link connects customers, service providers and cooperative administration so complaints can be reviewed and resolved transparently.',
      paymentIssue: 'Payment Issue',
      serviceQuality: 'Service Quality',
      latePickup: 'Late Pickup / Delivery',
      damaged: 'Damaged Clothes',
      missing: 'Missing Items',
      behaviour: 'Provider Behaviour',
      other: 'Other',
      submitted: 'Submitted',
      underReview: 'Under Review',
      resolved: 'Resolved',
      imageOnly:
        'Please select an image file.',
      imageSize:
        'Photo size should be less than 5 MB.',
      validation:
        'Please select a category and describe your complaint.',
    },

    ta: {
      support: 'கூட்டுறவு ஆதரவு',
      title: 'புகார்கள் & ஆதரவு',
      description:
        'உங்கள் பிரச்சினையை தெரிவிக்கவும். எங்கள் கூட்டுறவு ஆதரவு குழு நியாயமாகவும் வெளிப்படையாகவும் தீர்வு காண உதவும்.',
      raise: 'புகார் அளிக்கவும்',
      tellUs: 'என்ன நடந்தது என்பதை தெரிவிக்கவும்.',
      close: 'மூடு',
      category: 'புகார் வகை',
      selectCategory: 'வகையைத் தேர்ந்தெடுக்கவும்',
      orderId: 'ஆர்டர் எண்',
      orderPlaceholder: 'உதாரணம்: NXL-10234',
      issue: 'பிரச்சினையை விவரிக்கவும்',
      issuePlaceholder:
        'உங்கள் பிரச்சினையை தெளிவாக விளக்கவும்...',
      evidence: 'புகைப்பட ஆதாரம்',
      optional: 'விருப்பம்',
      upload: 'புகைப்படத்தை பதிவேற்றவும்',
      uploadDescription:
        'பிரச்சினையை காட்டும் புகைப்படத்தை சேர்க்கவும்',
      imageFormat: 'JPG, PNG • அதிகபட்சம் 5 MB',
      removePhoto: 'புகைப்படத்தை நீக்கவும்',
      attached: 'புகைப்பட ஆதாரம் இணைக்கப்பட்டுள்ளது',
      submit: 'புகாரை சமர்ப்பிக்கவும்',
      myComplaints: 'எனது புகார்கள்',
      complaint: 'புகார்',
      complaints: 'புகார்கள்',
      noComplaints: 'இதுவரை புகார்கள் இல்லை',
      noComplaintsDescription:
        'நீங்கள் சமர்ப்பித்த புகார்கள் இங்கே தோன்றும்.',
      order: 'ஆர்டர்',
      fairResolution:
        'நியாயமான & வெளிப்படையான தீர்வு',
      fairDescription:
        'NeXa Link வாடிக்கையாளர்கள், சேவை வழங்குநர்கள் மற்றும் கூட்டுறவு நிர்வாகத்தை இணைத்து புகார்களை வெளிப்படையாக பரிசீலித்து தீர்வு காண உதவுகிறது.',
      paymentIssue: 'பணம் செலுத்தும் பிரச்சினை',
      serviceQuality: 'சேவை தரம்',
      latePickup: 'தாமதமான Pickup / Delivery',
      damaged: 'சேதமடைந்த துணிகள்',
      missing: 'காணாமல் போன பொருட்கள்',
      behaviour: 'சேவை வழங்குநர் நடத்தை',
      other: 'மற்றவை',
      submitted: 'சமர்ப்பிக்கப்பட்டது',
      underReview: 'பரிசீலனையில்',
      resolved: 'தீர்க்கப்பட்டது',
      imageOnly:
        'தயவுசெய்து ஒரு புகைப்பட கோப்பைத் தேர்ந்தெடுக்கவும்.',
      imageSize:
        'புகைப்பட அளவு 5 MB-க்கு குறைவாக இருக்க வேண்டும்.',
      validation:
        'வகையைத் தேர்ந்தெடுத்து உங்கள் புகாரை விவரிக்கவும்.',
    },

    hi: {
      support: 'सहकारी सहायता',
      title: 'शिकायत और सहायता',
      description:
        'अपनी समस्या दर्ज करें। हमारी सहकारी सहायता टीम निष्पक्ष और पारदर्शी तरीके से समाधान में मदद करेगी।',
      raise: 'शिकायत दर्ज करें',
      tellUs: 'हमें बताएं कि क्या हुआ।',
      close: 'बंद करें',
      category: 'शिकायत की श्रेणी',
      selectCategory: 'श्रेणी चुनें',
      orderId: 'ऑर्डर आईडी',
      orderPlaceholder: 'उदाहरण: NXL-10234',
      issue: 'समस्या का विवरण',
      issuePlaceholder:
        'अपनी समस्या को स्पष्ट रूप से बताएं...',
      evidence: 'फोटो प्रमाण',
      optional: 'वैकल्पिक',
      upload: 'फोटो अपलोड करें',
      uploadDescription:
        'समस्या दिखाने वाली फोटो जोड़ें',
      imageFormat: 'JPG, PNG • अधिकतम 5 MB',
      removePhoto: 'फोटो हटाएं',
      attached: 'फोटो प्रमाण संलग्न है',
      submit: 'शिकायत सबमिट करें',
      myComplaints: 'मेरी शिकायतें',
      complaint: 'शिकायत',
      complaints: 'शिकायतें',
      noComplaints: 'अभी कोई शिकायत नहीं',
      noComplaintsDescription:
        'आपकी सबमिट की गई शिकायतें यहां दिखाई देंगी।',
      order: 'ऑर्डर',
      fairResolution:
        'निष्पक्ष और पारदर्शी समाधान',
      fairDescription:
        'NeXa Link ग्राहकों, सेवा प्रदाताओं और सहकारी प्रशासन को जोड़ता है ताकि शिकायतों की पारदर्शी तरीके से समीक्षा और समाधान किया जा सके।',
      paymentIssue: 'भुगतान समस्या',
      serviceQuality: 'सेवा की गुणवत्ता',
      latePickup: 'देर से Pickup / Delivery',
      damaged: 'क्षतिग्रस्त कपड़े',
      missing: 'गुम वस्तुएं',
      behaviour: 'सेवा प्रदाता का व्यवहार',
      other: 'अन्य',
      submitted: 'सबमिट किया गया',
      underReview: 'समीक्षा में',
      resolved: 'समाधान हो गया',
      imageOnly:
        'कृपया एक इमेज फाइल चुनें।',
      imageSize:
        'फोटो का आकार 5 MB से कम होना चाहिए।',
      validation:
        'कृपया श्रेणी चुनें और अपनी शिकायत का विवरण दें।',
    },
  }

  const content = text[language]

  const categoryLabels: Record<
    string,
    string
  > = {
    'Service Quality': content.serviceQuality,
    'Late Pickup / Delivery':
      content.latePickup,
    'Damaged Clothes': content.damaged,
    'Missing Items': content.missing,
    'Payment Issue': content.paymentIssue,
    'Provider Behaviour': content.behaviour,
    Other: content.other,
  }

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(content.imageOnly)
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(content.imageSize)
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhoto(null)
  }

  const submitComplaint = () => {
    if (!category || !description.trim()) {
      alert(content.validation)
      return
    }

    const newComplaint: Complaint = {
      id: `CMP-${Date.now()
        .toString()
        .slice(-6)}`,
      category,
      orderId: orderId || 'Not specified',
      description: description.trim(),
      status: 'Submitted',
      date: new Date().toLocaleDateString(
        'en-IN',
      ),
      photo: photo || undefined,
    }

    setComplaints((previous) => [
      newComplaint,
      ...previous,
    ])

    setCategory('')
    setOrderId('')
    setDescription('')
    setPhoto(null)
    setShowForm(false)
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-28 pt-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <section>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
            <ShieldCheck className="size-4 text-primary" />

            <span className="text-xs font-extrabold text-primary">
              {content.support}
            </span>
          </div>

          <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {content.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {content.description}
          </p>
        </section>

        {/* Raise complaint */}
        {!showForm && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-extrabold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <MessageSquare className="size-5" />
            {content.raise}
          </motion.button>
        )}

        {/* Complaint form */}
        {showForm && (
          <motion.section
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-display text-lg font-extrabold text-foreground">
                  {content.raise}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {content.tellUs}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={content.close}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  {content.category}
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">
                    {content.selectCategory}
                  </option>

                  {complaintCategories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {categoryLabels[item]}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Order ID */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  {content.orderId}
                </label>

                <input
                  value={orderId}
                  onChange={(event) =>
                    setOrderId(
                      event.target.value,
                    )
                  }
                  placeholder={
                    content.orderPlaceholder
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  {content.issue}
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder={
                    content.issuePlaceholder
                  }
                  rows={5}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Photo evidence */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  {content.evidence}

                  <span className="ml-1 font-normal text-muted-foreground">
                    ({content.optional})
                  </span>
                </label>

                {!photo ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-5 py-8 text-center transition-all hover:border-primary/50 hover:bg-primary/[0.025]">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                      <ImagePlus className="size-6 text-primary" />
                    </div>

                    <p className="text-sm font-extrabold text-foreground">
                      {content.upload}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {content.uploadDescription}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {content.imageFormat}
                    </p>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={
                        handlePhotoUpload
                      }
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
                    <img
                      src={photo}
                      alt={content.attached}
                      className="max-h-80 w-full object-contain"
                    />

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur transition hover:bg-black/80"
                      aria-label={
                        content.removePhoto
                      }
                    >
                      <X className="size-5" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur">
                      {content.attached}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={submitComplaint}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-extrabold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-[0.99]"
              >
                <Send className="size-4" />
                {content.submit}
              </button>
            </div>
          </motion.section>
        )}

        {/* Existing complaints */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-extrabold text-foreground">
              {content.myComplaints}
            </h2>

            {complaints.length > 0 && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                {complaints.length}{' '}
                {complaints.length === 1
                  ? content.complaint
                  : content.complaints}
              </span>
            )}
          </div>

          {complaints.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary">
                <AlertCircle className="size-7 text-muted-foreground" />
              </div>

              <p className="mt-4 font-bold text-foreground">
                {content.noComplaints}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {content.noComplaintsDescription}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map(
                (complaint) => (
                  <motion.article
                    key={complaint.id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-card)]"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-extrabold text-foreground">
                            {
                              categoryLabels[
                                complaint.category
                              ] ??
                                complaint.category
                            }
                          </p>

                          <p className="mt-1 text-xs font-medium text-muted-foreground">
                            {complaint.id} •{' '}
                            {complaint.date}
                          </p>
                        </div>

                        <ComplaintStatusBadge
                          status={
                            complaint.status
                          }
                          labels={{
                            submitted:
                              content.submitted,
                            underReview:
                              content.underReview,
                            resolved:
                              content.resolved,
                          }}
                        />
                      </div>

                      <p className="mt-4 text-sm leading-6 text-muted-foreground">
                        {complaint.description}
                      </p>

                      <div className="mt-3 rounded-xl bg-secondary/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
                        {content.order}:{' '}
                        <span className="text-foreground">
                          {complaint.orderId}
                        </span>
                      </div>

                      {complaint.photo && (
                        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
                          <img
                            src={
                              complaint.photo
                            }
                            alt={content.attached}
                            className="max-h-64 w-full object-contain"
                          />

                          <div className="border-t border-border px-3 py-2 text-xs font-medium text-muted-foreground">
                            📷 {content.attached}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.article>
                ),
              )}
            </div>
          )}
        </section>

        {/* Fair resolution */}
        <section className="overflow-hidden rounded-[1.5rem] border border-primary/15 bg-primary/[0.035] p-5 shadow-[var(--shadow-card)]">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="size-5 text-primary" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-foreground">
                {content.fairResolution}
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {content.fairDescription}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ComplaintStatusBadge({
  status,
  labels,
}: {
  status: ComplaintStatus
  labels: {
    submitted: string
    underReview: string
    resolved: string
  }
}) {
  if (status === 'Resolved') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-[10px] font-extrabold text-green-700">
        <CheckCircle2 className="size-3.5" />
        {labels.resolved}
      </span>
    )
  }

  if (status === 'Under Review') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-[10px] font-extrabold text-yellow-700">
        <Clock3 className="size-3.5" />
        {labels.underReview}
      </span>
    )
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-[10px] font-extrabold text-blue-700">
      <Clock3 className="size-3.5" />
      {labels.submitted}
    </span>
  )
}