import React from "react";

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ravtron.in";
  
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RAVTRON®",
    "legalName": "KSG Automation Pvt. Ltd.",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.png`,
    "description": "Trusted leader in IT, networking, display cabling, high-speed power adapters, surveillance solutions, and smart workspace products.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "0124 4111620",
      "contactType": "customer service",
      "email": "officerequirementsgurgaon@gmail.com",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No. 34, 3rd Floor, Deepak Building, Nehru Place",
      "addressLocality": "New Delhi",
      "addressRegion": "DL",
      "postalCode": "110019",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/ksgapl/",
      "https://www.linkedin.com/company/ravtron/posts/?feedView=all"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
    />
  );
}

export function ProductJsonLd({ product }) {
  if (!product) return null;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ravtron.in";
  const productUrl = `${baseUrl}/product/${product.id || product._id}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image ? [product.image] : undefined,
    "description": product.description || product.shortSpec || `${product.name} - Official RAVTRON® Product`,
    "sku": product.id || product._id,
    "brand": {
      "@type": "Brand",
      "name": "RAVTRON®"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.stock === undefined || product.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "RAVTRON®"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.8,
      "reviewCount": product.reviewsCount || 16
    } : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ravtron.in";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
