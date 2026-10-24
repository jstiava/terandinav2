import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion'
import { AccordionItem } from '@radix-ui/react-accordion'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/utilities/cn'
import SubscribeToNewsletterButton from './SubscribeToNewsletterButton'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  return (
    <footer className="flex flex-col items-center w-full h-fit py-8 md:py-12 ">



      <div className="flex flex-col w-full max-w-[120rem]">
        <div className={cn(
          "flex flex-col w-full",
          "md:flex-row"
        )}>

          <SubscribeToNewsletterButton />

          <div className="flex flex-col w-full h-fit p-0">

            {/* Accordion on mobile-medium */}
            <div className="flex w-full p-0 md:p-8 lg:hidden">
              <Accordion {...{
                type: "multiple",
                className: 'w-full divide-y divide-gray-200 md:border-0 border-t border-b border-gray-200'
              }}>
                {footerData.navItems?.map(item => {
                  return (
                    <AccordionItem key={item.id} value={item.menuItem.label} className='w-full '  >
                      <AccordionTrigger className='flex w-full! p-4'>
                        <div className="flex justify-between items-center w-full">
                          <span className='uppercase'>{item.menuItem.label}</span>
                          {/* <MinusIcon className='size-4' /> */}
                          <PlusIcon className='size-4' />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col w-full h-fit items-start px-4">
                          {item.children?.map(childItem => {

                            return (
                              <Button
                                key={childItem.id}
                                {...{
                                  asChild: true,
                                  variant: 'link',
                                  className: `flex items-start flex-col text-xs gap-4 w-full text-start px-0 h-10 `,
                                }}
                              >
                                <a {...{
                                  href: childItem.menuItem.type == 'reference' ? (childItem.menuItem.reference?.value as any).slug : childItem.menuItem.url,
                                  className: 'flex justify-start! w-full text-start! text-black'
                                }}>{childItem.menuItem.label}</a>
                              </Button>
                            )
                          })}

                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>

            {/* Row on large */}
            <div className="hidden lg:flex flex-1 min-w-0">
              <div className="flex w-full p-4">
                {footerData.navItems?.map(item => {
                  return (
                    <div
                      key={item.id}
                      {...{
                        className: `flex flex-col text-xs gap-4 p-4`,
                        style: {
                          width: `calc(100% / ${footerData.navItems?.length})`
                        }
                      }}
                    >
                      <span className='uppercase text-sm'>{item.menuItem.label}</span>
                      <div className="flex flex-col w-full h-fit items-start">
                        {item.children?.map(childItem => {

                          return (
                            <Button
                              key={childItem.id}
                              {...{
                                asChild: true,
                                variant: 'link',
                                className: `flex items-start flex-col text-xs gap-4 w-full text-start px-0 h-10`,
                              }}
                            >
                              <a {...{
                                href: childItem.menuItem.type == 'reference' ? (childItem.menuItem.reference?.value as any).slug : childItem.menuItem.url,
                                className: 'flex justify-start! w-full text-start!'
                              }}>{childItem.menuItem.label}</a>
                            </Button>
                          )
                        })}

                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Social media */}
        <div className="flex flex-col w-full h-fit py-8 px-6 gap-4">
          {/* <p>Social media area</p> */}
          <span className='text-xs'>Copyright © 2026 Terandina LLC - All rights reserved - v2.0.0</span>
          <Button {...{
            variant: 'link',
            className: "p-0 w-fit text-xs h-fit"
          }}>
            <a>Do not sell or share my personal information </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
