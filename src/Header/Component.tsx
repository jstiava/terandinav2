import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { Header as HeaderType } from '@/payload-types'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { MenuIcon, SearchIcon } from 'lucide-react';
import CartDrawer from '@/components/Cart/CartDrawer';
import { MobileNavigationMenu } from './MobileNavigationMenu';
import { cn } from '@/utilities/cn';
import { StickyHeader } from './StickyHeader';
import TopLoadingBar from '@/components/LoadingBar';


const MOBILE_MENU_ITEM_PROPS = {
  'wrapper': {
    className: 'flex items-center justify-start w-full'
  },
  'button': {
    className: 'flex items-center justify-start h-12 px-2 w-full underline-offset-4 hover:underline'
  },
  'link': {
    className: 'uppercase text-sm tracking-relaxed w-full text-start'
  }
} as const;

const MENU_ITEM_PROPS = {
  'wrapper': {
    className: 'flex items-center justify-center'
  },
  'button': {
    className: 'h-8 px-2 underline-offset-4 hover:underline'
  },
  'link': {
    className: 'uppercase text-xs tracking-relaxed'
  }
} as const;

export async function Header() {

  const headerData: HeaderType = await getCachedGlobal('header', 1)();

  return (
    <div className="flex w-full h-fit z-[5]">
      <StickyHeader>

        <div className="flex justify-between items-center max-w-[120rem] w-full">


          <a {...{
            href: "/"
          }}>
            <Image {...{
              src: "/logos/Terandina_clear.png",
              width: 40,
              height: 25,
              alt: "Terandina LLC"
            }} />

          </a>

          {/* Mobile nav bar */}
          <div className="flex sm:hidden w-fit px-0">
            <div className="flex w-fit px-2">
              <Button {...{
                variant: "ghost",
                className: "aspect-square"
              }}>
                <SearchIcon />
              </Button>
              <MobileNavigationMenu>
                <nav className="flex flex-col p-6 pt-14">
                  {headerData.navItems?.map(item => {

                    if (item.menuItem.type == 'reference') {
                      return (
                        <div key={item.id} {...{
                          ...MOBILE_MENU_ITEM_PROPS.wrapper
                        }}>
                          <Button {...{
                            ...MOBILE_MENU_ITEM_PROPS.button,
                            variant: 'custom',
                          }}>
                            <a {...{
                              ...MOBILE_MENU_ITEM_PROPS.link,
                              href: (item.menuItem.reference?.value as any).slug ?? ""
                            }}>{item.menuItem.label}
                            </a>
                          </Button>
                        </div>
                      )
                    }

                    if (item.menuItem.type == 'custom') {
                      return (
                        <div key={item.id} {...{
                          ...MOBILE_MENU_ITEM_PROPS.wrapper
                        }}>
                          <Button {...{
                            ...MOBILE_MENU_ITEM_PROPS.button,
                            variant: 'custom',
                          }}>
                            <a {...{
                              ...MOBILE_MENU_ITEM_PROPS.link,
                              href: item.menuItem.url ?? ""
                            }}>{item.menuItem.label}
                            </a>
                          </Button>
                        </div>
                      )
                    }

                    if (item.menuItem.type == 'label') {
                      return (
                        <div key={item.id} {...{
                          ...MOBILE_MENU_ITEM_PROPS.wrapper
                        }}>
                          <Button {...{
                            ...MOBILE_MENU_ITEM_PROPS.button,
                            variant: 'custom',
                          }}>
                            <a {...{
                              ...MOBILE_MENU_ITEM_PROPS.link
                            }}>{item.menuItem.label}
                            </a>
                          </Button>
                        </div>
                      )
                    }
                  })}
                </nav>
              </MobileNavigationMenu>
              <CartDrawer />
            </div>

          </div>


          {/* Desktop nav bar */}
          <div className="hidden sm:flex w-fit px-2">
            {headerData.navItems?.map(item => {

              if (item.menuItem.type == 'reference') {
                return (
                  <div key={item.id} {...{
                    ...MENU_ITEM_PROPS.wrapper
                  }}>
                    <Button {...{
                      ...MENU_ITEM_PROPS.button,
                      variant: 'custom',
                    }}>
                      <a {...{
                        ...MENU_ITEM_PROPS.link,
                        href: (item.menuItem.reference?.value as any).slug ?? ""
                      }}>{item.menuItem.label}
                      </a>
                    </Button>
                  </div>
                )
              }

              if (item.menuItem.type == 'custom') {
                return (
                  <div key={item.id} {...{
                    ...MENU_ITEM_PROPS.wrapper
                  }}>
                    <Button {...{
                      ...MENU_ITEM_PROPS.button,
                      variant: 'custom',
                    }}>
                      <a {...{
                        ...MENU_ITEM_PROPS.link,
                        href: item.menuItem.url ?? ""
                      }}>{item.menuItem.label}
                      </a>
                    </Button>
                  </div>
                )
              }

              if (item.menuItem.type == 'label') {
                return (
                  <div key={item.id} {...{
                    ...MENU_ITEM_PROPS.wrapper
                  }}>
                    <Button {...{
                      ...MENU_ITEM_PROPS.button,
                      variant: 'custom',
                    }}>
                      <a {...{
                        ...MENU_ITEM_PROPS.link
                      }}>{item.menuItem.label}
                      </a>
                    </Button>
                  </div>
                )
              }
            })}

            <div className="flex w-fit px-2">
              <Button {...{
                variant: "ghost",
                className: "aspect-square"
              }}>
                <SearchIcon />
              </Button>
              <CartDrawer />
            </div>
          </div>

        </div>

      </StickyHeader>
    </div>
  )
}
