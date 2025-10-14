import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import './TopNav.css'

const navigation = [
  { name: 'Book Now', href: '/', current: true },
  { name: 'Cancel Booking', href: '#', current: true },
  { name: 'About', href: '/about', current: true },
  { name: 'AI chatbot soon', href: '/about', current: false },
  { name: 'Instagram', href: 'https://instagram.com/alexyepbarber', current: true },
  { name: 'Policy', href: '#', current: true }, 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TopNav() {
  return (
    <Disclosure
      as="nav"
      className="barber-pole shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8" >
        <div className="relative flex h-14 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
                <a href = "https://instagram.com/alexyepbarber" target="_blank" rel="noopener noreferrer">
              <img 
                alt="AlexYepBarber"
                src = "/logo.jpg"
                className="h-10 w-auto rounded-edge border-2 border-white-500 rounded-lg opacity-90 shadow-lg"
              />
              </a>
            </div>
            {/* desktop nav*/}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}  
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}                  
                    className={classNames('rounded-md px-3 py-2 text-sm font-medium',
  'bg-white/85 text-gray-950 hover:bg-white transition-colors shadow-lg opacity-90' 
                      )}
                      onClick={(e) => {
                        if (item.href === '#soon') {
                          e.preventDefault()
                          alert('AI Chatbot is coming soon 👀')
                        }
                      }}
                      >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Mobile menu */}
<DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              onClick={(e) => {
                if (item.href === '#soon') {
                  e.preventDefault()
                  alert('AI Chatbot is coming soon 👀')
                }
              }}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
