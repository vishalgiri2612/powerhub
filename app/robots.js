export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ravtron.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin*",
          "/api*",
          "/cart",
          "/checkout",
          "/profile",
          "/login",
          "/signup"
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
