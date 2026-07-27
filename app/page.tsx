"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, X, Download } from "lucide-react"

const PDF_URL = "https://blobs.vusercontent.net/blob/Houston%20Magnify%202025%20Impact%20Report%20web-nSLk6cvK2iHwWS7yTLa4oT6oYmaVPN.pdf"

export default function Home() {
  const [showCursor, setShowCursor] = useState(true)
  const [textComplete, setTextComplete] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [showTypingIndicator, setShowTypingIndicator] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [showPdfTyping, setShowPdfTyping] = useState(false)
  const [showPdfMessage, setShowPdfMessage] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const fullText = "TEXT 'JOIN'"
  const phoneNumber = "832-895-2125"

  // Show typing indicator first, then show message
  useEffect(() => {
    const messageTimeout = setTimeout(() => {
      setShowTypingIndicator(false)
      setShowMessage(true)
    }, 2000)

    return () => clearTimeout(messageTimeout)
  }, [])

  // Typing animation effect
  useEffect(() => {
    if (!showMessage) return

    if (messageText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setMessageText(fullText.substring(0, messageText.length + 1))
      }, 150)

      return () => clearTimeout(timeout)
    } else {
      setTextComplete(true)
    }
  }, [messageText, showMessage])

  // Show PDF typing indicator after text is complete
  useEffect(() => {
    if (!textComplete) return

    const pdfTypingTimeout = setTimeout(() => {
      setShowPdfTyping(true)
    }, 1000)

    return () => clearTimeout(pdfTypingTimeout)
  }, [textComplete])

  // Show PDF message after typing indicator
  useEffect(() => {
    if (!showPdfTyping) return

    const pdfMessageTimeout = setTimeout(() => {
      setShowPdfTyping(false)
      setShowPdfMessage(true)
    }, 1500)

    return () => clearTimeout(pdfMessageTimeout)
  }, [showPdfTyping])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
    exit: { scale: 0.8, opacity: 0 },
  }

  const deliveredVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.5 } },
  }

  const typingVariants = {
    initial: { y: 0 },
    animate: { y: -5, transition: { repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 } },
  }

  const modalVariants = {
    initial: { scale: 0.8, opacity: 0, y: 50 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } },
  }

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-white">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-grow">
        {/* Header image */}
        <div className="w-full max-w-[320px] sm:max-w-[400px] mb-16">
          <Image
            src="/images/magshirt-20copy.png"
            alt="LET HOUSTON SEE HEAVEN"
            width={800}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="w-full max-w-[280px] sm:max-w-[320px] flex flex-col items-center">
          {/* Message container styled like iOS Messages */}
          <div className="flex flex-col items-center space-y-3 mb-2 w-full">
            {/* First typing indicator */}
            <AnimatePresence>
              {showTypingIndicator && (
                <motion.div
                  className="bg-[#E9E9EB] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center justify-center space-x-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-[#8E8E93] rounded-full"
                      variants={typingVariants}
                      initial="initial"
                      animate="animate"
                      transition={{
                        delay: i * 0.15,
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* First message bubble */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  className="bg-[#007AFF] text-white px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm text-center"
                  variants={bubbleVariants}
                  initial="initial"
                  animate="animate"
                >
                  <p className="text-lg font-medium tracking-wide">
                    {messageText}
                    {!textComplete && showCursor && <span className="opacity-70">|</span>}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {textComplete && (
              <motion.p
                className="text-sm text-[#8E8E93] mt-1"
                variants={deliveredVariants}
                initial="initial"
                animate="animate"
              >
                TO{" "}
                <a href={`sms:${phoneNumber}`} className="underline text-[#007AFF]">
                  {phoneNumber}
                </a>
              </motion.p>
            )}

            {/* PDF typing indicator */}
            <AnimatePresence>
              {showPdfTyping && (
                <motion.div
                  className="bg-[#E9E9EB] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center justify-center space-x-1 mt-4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-[#8E8E93] rounded-full"
                      variants={typingVariants}
                      initial="initial"
                      animate="animate"
                      transition={{
                        delay: i * 0.15,
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* PDF attachment message */}
            <AnimatePresence>
              {showPdfMessage && (
                <motion.button
                  onClick={() => setShowPdfPreview(true)}
                  className="bg-[#007AFF] text-white rounded-2xl rounded-bl-sm shadow-sm overflow-hidden mt-2 w-full max-w-[240px] text-left cursor-pointer hover:bg-[#0066DD] transition-colors"
                  variants={bubbleVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-white/10 p-3 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">2025 Impact Report</p>
                      <p className="text-xs text-white/70">PDF - Tap to view</p>
                    </div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mt-8">
        <div className="w-24 h-auto flex justify-center">
          <Image
            src="/images/magnify-new-20logo.png"
            alt="Magnify Logo"
            width={120}
            height={60}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* iOS-style PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowPdfPreview(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-2 sm:inset-4 md:inset-8 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* iOS-style header */}
              <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-[#F9F9F9]">
                <button
                  onClick={() => setShowPdfPreview(false)}
                  className="flex items-center gap-1 text-[#007AFF] font-medium text-sm hover:opacity-70 transition-opacity"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">Close</span>
                </button>
                <h3 className="text-xs sm:text-sm font-semibold text-black truncate max-w-[140px] sm:max-w-[180px]">
                  2025 Impact Report
                </h3>
                <a
                  href={PDF_URL}
                  download="Houston-Magnify-2025-Impact-Report.pdf"
                  className="flex items-center gap-1 text-[#007AFF] font-medium text-sm hover:opacity-70 transition-opacity"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Save</span>
                </a>
              </div>

              {/* PDF viewer - using Google Docs viewer for better mobile scaling */}
              <div className="flex-1 overflow-auto bg-[#525659]">
                <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(PDF_URL)}`}
                  className="w-full h-full min-h-[60vh]"
                  title="2025 Impact Report PDF"
                  style={{ border: 'none' }}
                />
              </div>

              {/* iOS-style bottom bar */}
              <div className="flex items-center justify-center gap-6 px-4 py-2 sm:py-3 border-t border-gray-200 bg-[#F9F9F9]">
                <a
                  href={PDF_URL}
                  download="Houston-Magnify-2025-Impact-Report.pdf"
                  className="flex flex-col items-center gap-1 text-[#007AFF] hover:opacity-70 transition-opacity"
                >
                  <Download className="w-6 h-6" />
                  <span className="text-xs">Download</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
