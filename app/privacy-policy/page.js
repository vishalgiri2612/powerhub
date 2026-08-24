"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  ChevronRight, 
  CheckCircle, 
  Mail, 
  MapPin,
  Building,
  Server,
  UserCheck,
  Cookie,
  CreditCard,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  Clock,
  Globe,
  ShoppingBag,
  Users,
  Shield,
  Scale
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "collect", label: "Information We Collect" },
    { id: "sources", label: "Information Sources" },
    { id: "usage", label: "How We Use Information" },
    { id: "disclosure", label: "Disclosing Information" },
    { id: "shopify", label: "Relationship with Shopify" },
    { id: "thirdparty", label: "Third Party Links" },
    { id: "children", label: "Children's Data" },
    { id: "security", label: "Security & Retention" },
    { id: "rights", label: "Your Rights & Choices" },
    { id: "complaints", label: "Complaints" },
    { id: "transfers", label: "International Transfers" },
    { id: "changes", label: "Changes & Contact" }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#334155] antialiased selection:bg-[#3674B5] selection:text-white">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 md:pt-14 pb-20 md:pb-28">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
          <Link href="/" className="hover:text-[#3674B5] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-700 font-bold">Privacy Policy</span>
        </nav>

        {/* Header Section */}
        <div className="space-y-4 max-w-3xl mb-10 text-left">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#1E293B] tracking-tight leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Policy</span>
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
            Ravtron - Exploring Ways to Connectivity operates this store and website, including all related information, content, features, tools, products and services.
          </p>
        </div>

        {/* Content Layout with Side Anchors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Quick Nav Sidebar (Desktop Sticky) */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 bg-[#F8F9FA] border border-slate-200/70 rounded-2xl p-4 space-y-2 shadow-2xs">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 pt-1">
                Policy Sections
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeSection === item.id
                        ? "bg-[#3674B5] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-200/80 px-3">
                <p className="text-[11px] font-semibold text-slate-500">Have questions?</p>
                <a href="mailto:officerequirementsgurgaon@gmail.com" className="text-xs font-bold text-[#3674B5] hover:underline break-all">
                  officerequirementsgurgaon@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8 text-left">

            {/* Overview / Introduction */}
            <section id="overview" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3674B5]/10 border border-[#3674B5]/20 flex items-center justify-center text-[#3674B5]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Privacy Policy Overview</h2>
                  <p className="text-xs text-slate-400 font-semibold">Last updated: February 26, 2026</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  <strong>Ravtron - Exploring Ways to Connectivity</strong> operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the &quot;Services&quot;). <strong>Ravtron - Exploring Ways to Connectivity</strong> is powered by Shopify, which enables us to provide the Services to you. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described in this Privacy Policy.
                </p>
              </div>
            </section>

            {/* Personal Information We Collect or Process */}
            <section id="collect" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Personal Information We Collect or Process</h2>
                  <p className="text-xs text-slate-400 font-semibold">Categories of data we collect depending on your interactions.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-4 pt-2 border-t border-slate-100">
                <p>
                  When we use the term &quot;personal information,&quot; we are referring to information that identifies or can reasonably be linked to you or another person. Personal information does not include information that is collected anonymously or that has been de-identified, so that it cannot identify or be reasonably linked to you. We may collect or process the following categories of personal information, including inferences drawn from this personal information, depending on how you interact with the Services, where you live, and as permitted or required by applicable law:
                </p>

                <div className="space-y-3">
                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Contact details
                    </h4>
                    <p className="text-xs text-slate-600">Including your name, address, billing address, shipping address, phone number, and email address.</p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Financial information
                    </h4>
                    <p className="text-xs text-slate-600">Including credit card, debit card, and financial account numbers, payment card information, financial account information, transaction details, form of payment, payment confirmation and other payment details.</p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Account information
                    </h4>
                    <p className="text-xs text-slate-600">Including your username, password, security questions, preferences and settings.</p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Transaction information
                    </h4>
                    <p className="text-xs text-slate-600">Including the items you view, put in your cart, add to your wishlist, or purchase, return, exchange or cancel and your past transactions.</p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Communications with us
                    </h4>
                    <p className="text-xs text-slate-600">Including the information you include in communications with us, for example, when sending a customer support inquiry.</p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Device information
                    </h4>
                    <p className="text-xs text-slate-600">Including information about your device, browser, or network connection, your IP address, and other unique identifiers.</p>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3674B5]" /> Usage information
                    </h4>
                    <p className="text-xs text-slate-600">Including information regarding your interaction with the Services, including how and when you interact with or navigate the Services.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information Sources */}
            <section id="sources" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Personal Information Sources</h2>
                  <p className="text-xs text-slate-400 font-semibold">Where we collect personal information from.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>We may collect personal information from the following sources:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#3674B5] shrink-0 mt-0.5" />
                    <span><strong>Directly from you:</strong> including when you create an account, visit or use the Services, communicate with us, or otherwise provide us with your personal information.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#3674B5] shrink-0 mt-0.5" />
                    <span><strong>Automatically through the Services:</strong> including from your device when you use our products or services or visit our websites, and through the use of cookies and similar technologies.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#3674B5] shrink-0 mt-0.5" />
                    <span><strong>From our service providers:</strong> including when we engage them to enable certain technology and when they collect or process your personal information on our behalf.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#3674B5] shrink-0 mt-0.5" />
                    <span><strong>From our partners or other third parties.</strong></span>
                  </li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Personal Information */}
            <section id="usage" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">How We Use Your Personal Information</h2>
                  <p className="text-xs text-slate-400 font-semibold">Purposes for processing your personal information.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-4 pt-2 border-t border-slate-100">
                <p>Depending on how you interact with us or which of the Services you use, we may use personal information for the following purposes:</p>
                
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs">Provide, Tailor, and Improve the Services</h4>
                    <p className="text-xs text-slate-600">
                      We use your personal information to provide you with the Services, including to perform our contract with you, to process your payments, to fulfill your orders, to remember your preferences and items you are interested in, to send notifications to you related to your account, to process purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, to facilitate any returns and exchanges, to enable you to post reviews, and to create a customized shopping experience for you, such as recommending products related to your purchases. This may include using your personal information to better tailor and improve the Services.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs">Marketing and Advertising</h4>
                    <p className="text-xs text-slate-600">
                      We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you online advertisements for products or services on the Services or other websites, including based on items you previously have purchased or added to your cart and other activity on the Services.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs">Security and Fraud Prevention</h4>
                    <p className="text-xs text-slate-600">
                      We use your personal information to authenticate your account, to provide a secure payment and shopping experience, detect, investigate or take action regarding possible fraudulent, illegal, unsafe, or malicious activity, protect public safety, and to secure our services. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password or other access details with anyone else.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs">Communicating with You</h4>
                    <p className="text-xs text-slate-600">
                      We use your personal information to provide you with customer support, to be responsive to you, to provide effective services to you and to maintain our business relationship with you.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-1">
                    <h4 className="font-extrabold text-[#1E293B] text-xs">Legal Reasons</h4>
                    <p className="text-xs text-slate-600">
                      We use your personal information to comply with applicable law or respond to valid legal process, including requests from law enforcement or government agencies, to investigate or participate in civil discovery, potential or actual litigation, or other adversarial legal proceedings, and to enforce or investigate potential violations of our terms or policies.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Disclose Personal Information */}
            <section id="disclosure" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">How We Disclose Personal Information</h2>
                  <p className="text-xs text-slate-400 font-semibold">Circumstances under which data may be shared with third parties.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:
                </p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] mt-2 shrink-0" />
                    <span>With Shopify, vendors and other third parties who perform services on our behalf (e.g. IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] mt-2 shrink-0" />
                    <span>With business and marketing partners to provide marketing services and advertise to you. For example, we use Shopify to support personalized advertising with third-party services based on your online activity with different merchants and websites. Our business and marketing partners will use your information in accordance with their own privacy notices. Depending on where you reside, you may have a right to direct us not to share information about you to show you targeted advertisements and marketing based on your online activity with different merchants and websites.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] mt-2 shrink-0" />
                    <span>When you direct, request us or otherwise consent to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] mt-2 shrink-0" />
                    <span>With our affiliates or otherwise within our corporate group.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] mt-2 shrink-0" />
                    <span>In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations (including to respond to subpoenas, search warrants and similar requests), to enforce any applicable terms of service or policies, and to protect or defend the Services, our rights, and the rights of our users or others.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Relationship with Shopify */}
            <section id="shopify" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Relationship with Shopify</h2>
                  <p className="text-xs text-slate-400 font-semibold">Hosting and data processing by Shopify platform.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  The Services are hosted by Shopify, which collects and processes personal information about your access to and use of the Services in order to provide and improve the Services for you. Information you submit to the Services will be transmitted to and shared with Shopify as well as third parties that may be located in countries other than where you reside, in order to provide and improve the Services for you. In addition, to help protect, grow, and improve our business, we use certain Shopify enhanced features that incorporate data and information obtained from your interactions with our Store, along with other merchants and with Shopify. To provide these enhanced features, Shopify may make use of personal information collected about your interactions with our store, along with other merchants, and with Shopify. In these circumstances, Shopify is responsible for the processing of your personal information, including for responding to your requests to exercise your rights over use of your personal information for these purposes.
                </p>
                <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-2xl space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    To learn more about how Shopify uses your personal information and any rights you may have, you can visit the{" "}
                    <a 
                      href="https://privacy.shopify.com/en" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#3674B5] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      Shopify Consumer Privacy Policy <ExternalLink className="w-3 h-3" />
                    </a>.
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    Depending on where you live, you may exercise certain rights with respect to your personal information at the{" "}
                    <a 
                      href="https://privacy.shopify.com/en" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#3674B5] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      Shopify Privacy Portal Link <ExternalLink className="w-3 h-3" />
                    </a>.
                  </p>
                </div>
              </div>
            </section>

            {/* Third Party Websites and Links */}
            <section id="thirdparty" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Third Party Websites and Links</h2>
                  <p className="text-xs text-slate-400 font-semibold">External links and social media widgets policy.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  The Services may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites. Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party. Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators, except as disclosed on the Services.
                </p>
              </div>
            </section>

            {/* Children's Data */}
            <section id="children" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Children&apos;s Data</h2>
                  <p className="text-xs text-slate-400 font-semibold">Protections regarding minor users.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority in your jurisdiction. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.
                </p>
                <p>
                  As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we &quot;share&quot; or &quot;sell&quot; (as those terms are defined in applicable law) personal information of individuals under 16 years of age.
                </p>
              </div>
            </section>

            {/* Security and Retention of Your Information */}
            <section id="security" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Security and Retention of Your Information</h2>
                  <p className="text-xs text-slate-400 font-semibold">Security measures and data retention criteria.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee &quot;perfect security.&quot; In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.
                </p>
                <p>
                  How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide you with Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.
                </p>
              </div>
            </section>

            {/* Your Rights and Choices */}
            <section id="rights" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Your Rights and Choices</h2>
                  <p className="text-xs text-slate-400 font-semibold">Legal rights available regarding your personal information.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-slate-200/60">
                    <h4 className="font-extrabold text-slate-900 text-xs mb-1">Right to Access / Know</h4>
                    <p className="text-xs text-slate-500">You may have a right to request access to personal information that we hold about you.</p>
                  </div>

                  <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-slate-200/60">
                    <h4 className="font-extrabold text-slate-900 text-xs mb-1">Right to Delete</h4>
                    <p className="text-xs text-slate-500">You may have a right to request that we delete personal information we maintain about you.</p>
                  </div>

                  <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-slate-200/60">
                    <h4 className="font-extrabold text-slate-900 text-xs mb-1">Right to Correct</h4>
                    <p className="text-xs text-slate-500">You may have a right to request that we correct inaccurate personal information we maintain about you.</p>
                  </div>

                  <div className="p-3.5 bg-[#F8F9FA] rounded-xl border border-slate-200/60">
                    <h4 className="font-extrabold text-slate-900 text-xs mb-1">Right of Portability</h4>
                    <p className="text-xs text-slate-500">You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-2">
                  <h4 className="font-extrabold text-slate-900 text-xs">Managing Communication Preferences</h4>
                  <p className="text-xs text-slate-600">
                    We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you. If you opt out, we may still send you non-promotional emails, such as those about your account or orders that you have made.
                  </p>
                  <p className="text-xs text-slate-600">
                    You may exercise any of these rights where indicated on the Services or by contacting us using the contact details provided below. To learn more about how Shopify uses your personal information and any rights you may have, including rights related to data processed by Shopify, you can visit{" "}
                    <a 
                      href="https://privacy.shopify.com/en" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#3674B5] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      https://privacy.shopify.com/en <ExternalLink className="w-3 h-3" />
                    </a>.
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  We will not discriminate against you for exercising any of these rights. We may need to verify your identity before we can process your requests, as permitted or required under applicable law. In accordance with applicable laws, you may designate an authorized agent to make requests on your behalf to exercise your rights. Before accepting such a request from an agent, we will require that the agent provide proof you have authorized them to act on your behalf, and we may need you to verify your identity directly with us. We will respond to your request in a timely manner as required under applicable law.
                </p>
              </div>
            </section>

            {/* Complaints */}
            <section id="complaints" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">Complaints</h2>
                  <p className="text-xs text-slate-400 font-semibold">Procedure for lodging privacy complaints.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  If you have complaints about how we process your personal information, please contact us using the contact details provided below. Depending on where you live, you may have the right to appeal our decision by contacting us using the contact details set out below, or lodge your complaint with your local data protection authority.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section id="transfers" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-[#1E293B]">International Transfers</h2>
                  <p className="text-xs text-slate-400 font-semibold">Cross-border processing and standard contractual clauses.</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 space-y-3 pt-2 border-t border-slate-100">
                <p>
                  Please note that we may transfer, store and process your personal information outside the country you live in.
                </p>
                <p>
                  If we transfer your personal information out of the European Economic Area or the United Kingdom, we will rely on recognized transfer mechanisms like the European Commission&apos;s Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection.
                </p>
              </div>
            </section>

            {/* Changes & Contact */}
            <section id="changes" className="bg-[#F8F9FA] border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-[#1E293B]">Changes to This Privacy Policy & Contact Details</h2>
                    <p className="text-xs text-slate-400 font-semibold">Policy updates and direct contact information.</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
                  We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this website, update the &quot;Last updated&quot; date and provide notice as required by applicable law.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                <h3 className="font-display font-black text-base text-[#1E293B]">Contact Us</h3>
                <p className="text-xs font-medium text-slate-600">
                  Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please call or email us at:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="flex items-start gap-3 p-3.5 bg-[#F8F9FA] rounded-xl border border-slate-200/60">
                    <Mail className="w-4 h-4 text-[#3674B5] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase">Email Address</p>
                      <a href="mailto:officerequirementsgurgaon@gmail.com" className="text-slate-900 hover:text-[#3674B5] font-bold break-all">
                        officerequirementsgurgaon@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-[#F8F9FA] rounded-xl border border-slate-200/60">
                    <MapPin className="w-4 h-4 text-[#3674B5] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase">Postal Address</p>
                      <p className="text-slate-900 font-bold leading-tight">
                        No. 34, 3rd Floor, Deepak Building, Nehru Place, New Delhi, DL, 110019, IN
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </main>

      <Footer />
      <SearchModal />
    </div>
  );
}
