import { Fieldset } from "@headlessui/react"
import { Bold } from "lucide-react"

export default function About() {
    return (
      <div className="min-h-screen w-full">
        <div className="bg-white min-w-[1000px] rounded-lg p-40 shadow-xl hover:shadow-xl hover:scale-110 transition-all duration-200 border-2">
        <h2 className="text-4xl font-bold mb-8 text-gray-900 -ml-10">About Alex</h2>
        <div className="flex flex-col md:flex-row gap-8 mb-8">          
            <img 
            src="/Barber.jpg" 
            alt="Alex Yep" 
            className="w-32 h-32 rounded object-cove -ml-10"
          />
          <div className="flex-1" >
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">3 Years</p>
                <p className="text-sm text-gray-600">Professional Experience</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">Saratoga/SJ</p>
                <p className="text-sm text-gray-600">Location</p>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-m">
                Welcome! I'm Alex, a passionate barber from the Bay Area dedicated to helping you <em>invest</em> in your looks! 
                With <strong>three</strong> years of experience cutting college and highschoolers all over the bay,
                I've honed my skills in classic and modern cutting techniques.
              </p>
              
              <p>
                I specialize in <strong>any style</strong> of haircuts, wether it be straight, curly, or afro. Additionally, years of trial and error
                taught me to create styles that complement 
                your face shape and personality. Whether you're looking for a smart cut, a trendy 
                blowout taper, or just a salon styled scissor trim, <strong>I take pride in delivering quality results consistently.</strong>
              </p>
              
              <p>
              My approach is simple: a quick consultation, experience-based recommendations, and ensure 
              you leave feeling confident and refreshed. 
                <strong> A great haircut is more than just a service with me, it is an investment in yourself.</strong>
                After my service, you will know exactly how to style, maintain, and when to come back for a haircut in order to keep looking your shaprest.
              </p>
            </div>
            
            <button className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md" 
            onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
              }}>
              Book Now
            </button>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h3 className="font-semibold text-lg mb-3">Follow Me</h3>
          <a 
            href="https://instagram.com/alexyepbarber" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @alexyepbarber on Instagram
          </a>
        </div>
      </div>
    </div>
  )
}
