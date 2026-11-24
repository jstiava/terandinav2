import configPromise from '@payload-config'
import React from 'react'
import { Header as HeaderType } from '@/payload-types'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import CartDrawer from '@/components/Cart/CartDrawer';
import { MobileNavigationMenu } from './MobileNavigationMenu';
import { cn } from '@/utilities/cn';
import { StickyHeader } from './StickyHeader';
import SearchDrawer from '@/Header/SearchDrawer';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import { RenderBlocks } from '@/blocks/RenderBlocks';
import MediaQuery from '@/components/MediaQuery';


const MOBILE_MENU_ITEM_PROPS = {
  'wrapper': {
    className: 'flex items-center justify-start w-full'
  },
  'button': {
    className: 'flex items-center justify-start h-14 px-2 w-full underline-offset-4 hover:underline'
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

export async function Header({ data }: { data: HeaderType }) {


  const products = await getAllProducts_cached();
  const categories = await getAllCategories_cached();

  return (
    <div className="flex w-full h-fit z-[5]">
      <StickyHeader>

        <div className="flex justify-between items-center max-w-[130rem] w-full">


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
            <MediaQuery query="(max-width: 767px)">
              <div className="flex w-fit px-2">
                <SearchDrawer {...{
                  products,
                  categories
                }} >
                  <div className="flex flex-col w-full">
                    {data.presearchRecommendationContent && <RenderBlocks blocks={data.presearchRecommendationContent} />}
                  </div>
                </SearchDrawer>
                <MobileNavigationMenu>
                  <nav className="flex flex-col p-6 pt-16">
                    {data.navItems?.map(item => {

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

                <CartDrawer key={'mobile_cart_drawer'} />
              </div>
            </MediaQuery>

          </div>


          {/* Desktop nav bar */}
          <div className="hidden sm:flex w-fit px-2">
            {data.navItems?.map(item => {

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

            <MediaQuery query="(min-width: 640px)">
              <div className="flex w-fit px-2">
                <SearchDrawer {...{
                  products,
                  categories
                }}>
                  <div className="flex flex-col w-full">
                    {data.presearchRecommendationContent && <RenderBlocks blocks={data.presearchRecommendationContent} />}
                  </div>
                </SearchDrawer>

                <CartDrawer key={'desktop_cart_drawer'} />
              </div>
            </MediaQuery>
          </div>

        </div>

      </StickyHeader>
    </div>
  )
}


const getAllProducts = async () => {

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'products',
    draft: false,
    depth: 2,
    pagination: false,
    where: {
      active: {
        equals: true
      }
    }
  })

  return result.docs;
}

async function getAllProducts_cached() {
  return unstable_cache(
    async () => {
      const product = await getAllProducts();
      return product;
    },
    ["products"],
    { tags: ['products'] }
  )();
}



const getAllCategories = async () => {

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'categories',
    draft: false,
    depth: 2,
    pagination: false, 
    where: {
      showInSearch: {
        equals: true
      }
    }
  })

  return result.docs;
}

async function getAllCategories_cached() {
  return unstable_cache(
    async () => {
      const categories = await getAllCategories();
      return categories;
    },
    ["categories"],
    { tags: ['categories'] }
  )();
}

