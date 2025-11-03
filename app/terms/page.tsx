"use client"

import { useEffect, useRef, useState } from "react"
import { Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function TermsPage() {
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-gray-900">EarningHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</a>
            <a href="/about" className="text-gray-700 hover:text-green-600 transition-all duration-300">About</a>
            <a href="/plans" className="text-gray-700 hover:text-green-600 transition-all duration-300">Plan</a>
            <a href="/terms" className="text-green-600 font-medium">Terms & Condition</a>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-green-600">
          Terms of Use
        </h1>

        <div className="prose prose-sm md:prose-base max-w-none space-y-6 text-gray-700">
          {/* Copyright Notice */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Copyright Notice</h2>
            <p className="mb-4">
              All rights reserved. All materials on this site are subject to the copyright and other intellectual 
              property rights of EarningHub, its affiliated companies and its licensors. These materials are for 
              editorial use only. They may not be copied for commercial use or distribution, nor may these materials 
              be modified.
            </p>
          </section>

          {/* Trademark Notice */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trademark Notice</h2>
            <p className="mb-4">
              All trademarks displayed on this site are subject to the trademark rights of EarningHub or its 
              affiliates companies. These trademarks include, but are not limited to, product brand names, service 
              names, slogans, and logos and emblems. The unauthorized use of any trademark displayed on this site 
              is strictly prohibited.
            </p>
          </section>

          {/* Effective Date */}
          <section className="mb-8">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Effective Date:</strong> November 3, 2025
            </p>
            <p className="mb-4">
              Welcome to EarningHub (the "Site"). This Site is operated by EarningHub (hereinafter referred to as 
              "EarningHub") and materials on the Site are owned, for the most part, by EarningHub or its affiliated 
              companies. The Site may also include materials owned by third parties and posted on the Site by virtue 
              of a license, grant or some other form of agreement between the third party and EarningHub.
            </p>
          </section>

          {/* Terms Agreement */}
          <section className="mb-8">
            <p className="mb-4">
              Please read these Terms of Use detailed below (the "Terms") which set forth the legally binding terms 
              governing your use of this Site. The Terms apply to all persons who visit this Site ("Visitors"), 
              regardless of your level of participation; by visiting this Site you accept and agree to be bound by 
              the Terms set forth herein.
            </p>
            <p className="mb-4">
              In these Terms, "you" and "your" refer to each Visitor and his or her agents (unless the context 
              requires otherwise), and "we", "us" and "our" refer collectively to EarningHub. These Terms explain 
              our obligations to you, and your obligations to us in relation to the Use of this Site.
            </p>
          </section>

          {/* Age Restriction */}
          <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="font-semibold text-gray-900">
              THIS SITE IS ONLY INTENDED FOR VIEWING IF YOU ARE EIGHTEEN YEARS OR OLDER and not a minor in your 
              state of residence. If you are not an intended viewer, kindly do not use or view this Site.
            </p>
          </section>

          {/* Revisions */}
          <section className="mb-8">
            <p className="mb-4">
              We may at any time revise these Terms by updating this posting. You are bound by such revisions and 
              should therefore visit this page to review the current Terms from time to time. NOTE THAT THE TERMS 
              OF USE APPLY ONLY TO THIS SITE, AND OTHER WEBSITES PROVIDED BY EARNINGHUB HAVE DIFFERENT TERMS AND 
              CONDITIONS THAT APPLY TO THE USE OF THOSE SITES.
            </p>
            <p className="mb-4">
              This Site is for editorial use only. Any other use of the Site requires the prior written consent of 
              EarningHub.
            </p>
          </section>

          {/* 1. Description of Site */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. DESCRIPTION OF THIS SITE</h2>
            <p className="mb-4">
              This Site contains information regarding EarningHub and its products and promotional programs, 
              including advertising, logos, trademarks, pictures, information, digital images, and other content 
              (collectively, "Content"), all of which is protected under copyright law and/or other federal and 
              state laws. Content may be in the form of text, data, music, sound, graphics, images, pictures, 
              photographs, videos, software or other forms now known or later invented.
            </p>
          </section>

          {/* 2. Access to Site */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. ACCESS TO THIS SITE</h2>
            <p className="mb-4">
              EarningHub reserves the right at any time and from time to time to modify, suspend, discontinue or 
              permanently cancel the Site's operation, or portions thereof, with or without notice to you.
            </p>
          </section>

          {/* 3. Downloads */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. DOWNLOADS FROM THIS SITE</h2>
            <p className="mb-4">
              When you download any content from this Site, you understand that it is owned by EarningHub, its 
              affiliate and/or licensors, as applicable, and protected by intellectual property laws. EarningHub 
              hereby grants, and you hereby accept, a limited, non-exclusive, non-transferable, revocable right and 
              license to download and use the object code version of the Download(s) on your own computer that is 
              compatible solely for editorial use only.
            </p>
            <p className="mb-4">
              You acknowledge and agree that you may not reproduce, duplicate, modify, perform, transfer, post, 
              distribute, sell, create derivative works of or otherwise use or make available the Download(s). No 
              license is granted to you in the human readable code, known as the source code, of the content 
              downloaded, and no rights are granted to you in any patents, copyrights, trade secrets, trademarks or 
              any other rights in respect of the content of any Download(s).
            </p>
            <p className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <strong>YOU UNDERSTAND AND AGREE THAT YOUR USE OF THE SITE AND/OR ANY SERVICE, INCLUDING, BUT NOT 
              LIMITED TO ANY DOWNLOAD(S), IS SOLELY AT YOUR OWN RISK AND THAT YOU WILL BE SOLELY RESPONSIBLE FOR 
              ANY DAMAGE TO YOUR COMPUTER, ANY OTHER EQUIPMENT, OR LOSS OF DATA THAT MAY RESULT FROM YOUR USE OF 
              THIS SITE, THE SERVICE AND/OR DOWNLOAD(S). YOU AGREE THAT THE SERVICE IS PROVIDED ON AN "AS IS" AND 
              "AS AVAILABLE" BASIS.</strong>
            </p>
          </section>

          {/* 4. Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. INTELLECTUAL PROPERTY; COPYRIGHT AGENT</h2>
            <p className="mb-4">
              We respect the intellectual property of others, and we ask our users to do the same. If you are the 
              owner of a United States copyright and you believe that your work has been copied on this Site in a 
              way that constitutes copyright infringement, or your intellectual property rights have been otherwise 
              violated, please provide our Copyright Agent the following information:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>a physical signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest;</li>
              <li>a description of the copyrighted work or other intellectual property that you claim has been infringed;</li>
              <li>a description of where the material that you claim is infringing is located on this Site;</li>
              <li>your address, telephone number, and e-mail address;</li>
              <li>a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; and</li>
              <li>a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner's behalf.</li>
            </ul>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Our agent for notice of claims can be reached as follows:</p>
              <p className="mb-2"><strong>By mail:</strong></p>
              <p className="pl-4">
                Copyright Agent<br />
                c/o EarningHub Customer Experience<br />
                EarningHub Inc.<br />
                [Address]<br />
                [City, State, Zip]
              </p>
            </div>
            <p className="text-sm italic">
              NOTE: Please do not submit ideas or suggestions regarding current or future EarningHub products, 
              promotions or advertising. For legal reasons, we do not accept such unsolicited ideas or suggestions.
            </p>
          </section>

          {/* 5. Indemnity */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. INDEMNITY AND HOLD HARMLESS</h2>
            <p className="mb-4">
              You agree to defend, indemnify and hold harmless EarningHub and its parent, subsidiaries and 
              affiliates, their respective distributors, dealers, dealer associations and advertising and promotions 
              agencies, together with their respective employees, agents, directors, officers and shareholders 
              (collectively, "EarningHub Parties"), from and against all the liabilities, claims, damages and 
              expenses (including reasonable attorneys' fees and costs) arising out of your use of this Site, your 
              breach or alleged breach of these Terms, or your breach or alleged violation of the patent, copyright, 
              trademark, proprietary or other rights of third parties.
            </p>
          </section>

          {/* 6. Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. DISCLAIMER OF WARRANTIES</h2>
            <p className="mb-4">
              You understand and agree that your use of the Site is solely at your own risk and that you will be 
              solely responsible for any damage to your mobile device or computer or any other equipment or loss of 
              data that may result from your use of this Site. This Site and its Content are provided on an "AS IS" 
              and "AS AVAILABLE" basis without any warranty of any kind, expressed, implied or statutory.
            </p>
            <p className="mb-4">
              We specifically disclaim any implied warranties of merchantability, fitness for a particular purpose, 
              and non-infringement. EarningHub makes no warranties that this Site or any material obtained through 
              herein will meet your requirements, or that this Site will be uninterrupted, timely, secure, 
              non-infringing or error free.
            </p>
            <p className="mb-4">
              Any decision or action taken by you on the basis of information or content provided on this site is 
              at your sole discretion and risk. We are not responsible or liable for any such decision, or for the 
              accuracy, completeness, usefulness, or availability of any content displayed, transmitted, or 
              otherwise made available on this Site.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. LIMITATION OF LIABILITIES AND RELEASE OF LIABILITY</h2>
            <p className="mb-4">
              Except in jurisdictions where such provisions are restricted, you agree that EarningHub's entire 
              liability to you or any third person, and your or any third person's exclusive remedy, in law, in 
              equity, or otherwise, with respect to the service provided under these Terms of Use and/or for any 
              breach of these Terms is solely limited to the amount fifty cents ($.50).
            </p>
            <p className="mb-4">
              Except in jurisdictions where such provisions are restricted, EarningHub parties and their licensors 
              and contractors (including any third parties providing all or part of the service) (collectively, 
              "released parties") shall not be liable for any indirect, incidental, special or consequential damages 
              even if the released parties have been advised of the possibility of such damages.
            </p>
            <p className="mb-4">
              You hereby release, discharge, indemnify and hold harmless each of the released parties from and 
              against any claims, damages, expenses and liability arising from or related to any injuries, damages 
              or losses to any person (including death) or property of any kind resulting in whole or part, directly 
              or indirectly, from your use of this Site.
            </p>
          </section>

          {/* 8. No Offer to Sell */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. NO OFFER TO SELL OR LEASE</h2>
            <p className="mb-4">
              All of the information contained in this Site is for information purposes only and in no way 
              constitutes an offer to buy or sell products or services. The purchase of any services shall be 
              subject to the terms and conditions of the applicable agreement. This site shall not be used or relied 
              upon by you as a substitute for information that is available to you from authorized sources.
            </p>
          </section>

          {/* 9. Miscellaneous */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. MISCELLANEOUS</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">(a) Notices And Announcements</h3>
            <p className="mb-4">
              Except as expressly provided otherwise herein, all notices to EarningHub shall be in writing and 
              delivered via overnight courier or certified mail, return receipt requested to:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p>
                EarningHub Customer Relations<br />
                [Address]<br />
                [City, State, Zip]
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">(b) Severability</h3>
            <p className="mb-6">
              If any provision of these Terms of Use are unlawful, void or unenforceable, that provision is deemed 
              severable from these Terms and does not affect the validity and enforceability of any remaining 
              provisions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">(c) Entire Agreement</h3>
            <p className="mb-6">
              These Terms constitute the entire, complete and exclusive agreement between you and us regarding this 
              Site and supersedes all prior agreements and understandings with respect to the subject matter of 
              these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">(d) Waiver</h3>
            <p className="mb-4">
              The remedies of EarningHub set forth in these Terms shall be cumulative and not alternative, and the 
              election of one remedy for a breach shall not preclude pursuit of other remedies. Any failure by us, 
              at any time or from time to time, to enforce any of our rights under these Terms shall not constitute 
              a waiver of such right.
            </p>
          </section>

          {/* Guidelines for External Sites */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GUIDELINES FOR EXTERNAL SITES</h2>
            <p className="mb-4">
              If you would like to use EarningHub information or link to our site, please read and comply with the 
              following guidelines and all applicable laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">External Site Use of EarningHub Information</h3>
            <p className="mb-4">
              Third-party sites must have prior written approval before using any text, trademarks, graphics or 
              photographs from any EarningHub source, such as Web sites or brochures.
            </p>
            <p className="mb-6">
              Third-party sites may use brand or model names in site texts only to the extent necessary to identify 
              EarningHub products. Any other use of EarningHub brand names or any use of EarningHub logos, 
              trademarks, service marks, model names or service names is expressly not allowed. Also not allowed is 
              the use of text or any other material in any way that implies sponsorship, approval of or affiliation 
              with EarningHub.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">External Site Naming Guidelines</h3>
            <p className="mb-6">
              Third parties may not use a brand, product name or other confusingly similar word or group of letters 
              in a domain name (similar to the brand names, trademarks and/or trade names of EarningHub and/or its 
              affiliated companies) without prior written EarningHub approval.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Misrepresentation</h3>
            <p className="mb-6">
              Third-party sites must not in any way imply that EarningHub is endorsing it or its products or 
              services; must not misrepresent its relationship with EarningHub; must not present false information 
              about EarningHub; must not be a site that infringes any intellectual property or other right of any 
              person or that otherwise does not comply with all relevant laws and regulations; and must not be a 
              site that contains content that could be construed as distasteful, offensive or controversial.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Linking to EarningHub</h3>
            <p className="mb-6">
              Third-party sites may not use links to EarningHub in any way that implies sponsorship or affiliation. 
              Furthermore, when linking to EarningHub, that site may not appear as a frame within the site that 
              provides the link or appear in any way that makes the destination site appear to be content belonging 
              to the site containing the link.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">External Site Disclaimer</h3>
            <p className="mb-4">
              Third-party sites must include a prominently displayed disclaimer on the home page stating that the 
              site is not authorized by or affiliated with EarningHub.
            </p>
          </section>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gray-900 text-white mt-auto overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className={`col-span-1 transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="font-bold text-white text-lg">EarningHub</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                We are a award winning multinational company. We believe quality and standard worldwide consider.
              </p>
            </div>

            {/* Quick Links */}
            <div className={`transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-600"></span>
              </h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Home</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">About</a></li>
                <li><a href="/plans" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Plan</a></li>
              </ul>
            </div>

            {/* Company Policy */}
            <div className={`transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Company Policy
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-600"></span>
              </h3>
              <ul className="space-y-3">
                <li><a href="/faq" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">FAQ</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Terms & Condition</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className={`transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Newsletter
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-600"></span>
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get our offers & news in your inbox
              </p>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-white text-gray-900 border-none rounded-full pl-4 pr-12 py-6 focus:ring-2 focus:ring-green-600 transition-all duration-300"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className={`border-t border-gray-800 transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              Copyright © 2025 <span className="text-green-600 font-semibold">EarningHub</span> All Rights Reserved
            </p>
            <div className="text-green-600 text-sm font-medium mt-2 md:mt-0">
              English
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
