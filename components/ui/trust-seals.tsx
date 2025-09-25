import React from 'react';

// SSL/TLS Security Badge
export const SSLBadge = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg ${className}`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      <rect x="4" y="10" width="16" height="10" rx="2" fill="#16a34a"/>
      <circle cx="12" cy="15" r="2" fill="white"/>
    </svg>
    <div className="text-xs">
      <div className="font-semibold text-green-800">SSL Seguro</div>
      <div className="text-green-600">256-bit</div>
    </div>
  </div>
);

// Payment Methods Badges
export const PaymentBadges = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Visa */}
    <div className="bg-white border border-gray-200 rounded px-2 py-1">
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="white"/>
        <path d="M13.2 6.5L11.8 13.5H10.2L8.8 6.5H10.4L11.3 11.2L12.6 6.5H13.2Z" fill="#1A1F71"/>
        <path d="M15.8 6.5L14.4 13.5H12.8L14.2 6.5H15.8Z" fill="#1A1F71"/>
        <path d="M19.2 8.5C19.2 7.8 18.7 7.5 17.9 7.5C17.1 7.5 16.5 7.9 16.5 8.6C16.5 9.1 16.9 9.4 17.6 9.6C18.3 9.8 18.6 10 18.6 10.3C18.6 10.7 18.1 10.9 17.5 10.9C16.8 10.9 16.3 10.6 16.3 10.6L16.1 11.8S16.7 12 17.6 12C18.8 12 19.5 11.4 19.5 10.5C19.5 9.9 19.1 9.6 18.3 9.4C17.7 9.2 17.4 9 17.4 8.7C17.4 8.4 17.8 8.2 18.4 8.2C18.9 8.2 19.3 8.4 19.3 8.4L19.2 8.5Z" fill="#1A1F71"/>
        <path d="M22.5 6.5L21.5 13.5H20L18.5 9.2L17.9 12.2C17.8 12.8 17.4 13 16.9 13H15.5L17.2 6.5H18.8L19.8 10.8L21.8 6.5H22.5Z" fill="#1A1F71"/>
      </svg>
    </div>
    
    {/* Mastercard */}
    <div className="bg-white border border-gray-200 rounded px-2 py-1">
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="white"/>
        <circle cx="12" cy="10" r="6" fill="#EB001B"/>
        <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
        <path d="M16 6C17.1 7.1 17.8 8.5 17.8 10C17.8 11.5 17.1 12.9 16 14C14.9 12.9 14.2 11.5 14.2 10C14.2 8.5 14.9 7.1 16 6Z" fill="#FF5F00"/>
      </svg>
    </div>
    
    {/* PayPal */}
    <div className="bg-white border border-gray-200 rounded px-2 py-1">
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="white"/>
        <path d="M8 6H12C14 6 15 7 15 9C15 11 14 12 12 12H10L9 15H7L8 6Z" fill="#003087"/>
        <path d="M10 8H11.5C12.2 8 12.5 8.3 12.5 9C12.5 9.7 12.2 10 11.5 10H10L10 8Z" fill="white"/>
        <path d="M13 6H17C19 6 20 7 20 9C20 11 19 12 17 12H15L14 15H12L13 6Z" fill="#009CDE"/>
        <path d="M15 8H16.5C17.2 8 17.5 8.3 17.5 9C17.5 9.7 17.2 10 16.5 10H15L15 8Z" fill="white"/>
      </svg>
    </div>
  </div>
);

// GDPR Privacy Badge
export const GDPRBadge = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#2563eb"/>
      <circle cx="12" cy="12" r="8" stroke="#2563eb" strokeWidth="1.5" fill="none"/>
    </svg>
    <div className="text-xs">
      <div className="font-semibold text-blue-800">GDPR</div>
      <div className="text-blue-600">Protegido</div>
    </div>
  </div>
);

// Money Back Guarantee Badge
export const MoneyBackBadge = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg ${className}`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="2"/>
      <path d="M9 12L11 14L15 10" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div className="text-xs">
      <div className="font-semibold text-emerald-800">Garantía</div>
      <div className="text-emerald-600">100%</div>
    </div>
  </div>
);

// Complete Trust Seals Component
export const TrustSeals = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
    <SSLBadge />
    <PaymentBadges />
    <GDPRBadge />
    <MoneyBackBadge />
  </div>
);

export default TrustSeals;