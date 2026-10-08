import { Button } from '@/components/ui/button'
import { CloseMenuIcon } from '@payloadcms/ui'
import { XIcon } from 'lucide-react'
import { JSX, useState, RefObject, useEffect, useRef } from 'react'

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
): void
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(eventName: K, handler: (event: HTMLElementEventMap[K]) => void, element: RefObject<T>): void

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement | void = void,
>(
  eventName: KW | KH,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
  element?: RefObject<T>,
) {
  // @ts-expect-error
  const savedHandler = useRef<typeof handler>()

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window
    if (!(targetElement && targetElement.addEventListener)) return

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler
    }

    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => {
      if (savedHandler?.current) {
        savedHandler.current(event)
      }
    }

    targetElement.addEventListener(eventName, eventListener)

    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element, handler])
}

export default function Cursor({
  isOpen,
  children = <></>,
  onClose = () => {}
}: {
  isOpen: boolean
  children?: JSX.Element | null
  onClose?: any
}) {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const check = () => setIsSmall(window.matchMedia('(max-width: 1024px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [{ clientX, clientY }, setPosition] = useState({
    clientX: 0,
    clientY: 0,
  })

  useEventListener('mousemove', ({ clientX, clientY }) => setPosition({ clientX, clientY }))

  if (!children) {
    return null
  }

  if (!clientX || !clientY) {
    return null
  }

  return (
    <div
      style={{
        // backgroundColor: 'red',
        width: '0.5rem',
        height: '0.5rem',
        position: 'fixed',
        pointerEvents: 'auto',
        top: isSmall ? 'unset' : `${clientY}px`,
        bottom: isSmall ? '1rem' : 'unset',
        left: isSmall ? '0.5rem' : `${clientX}px`,
        zIndex: 1000,
      }}
      onPointerEnter={e => {
        e.stopPropagation();
      }}
      onPointerMove={e => {
        e.stopPropagation();
      }}
    >
      {isOpen && children && (
        <div
          className="flex items-start justify-start shadow-md"
          style={{
            width: isSmall ? '100vw' : 'fit-content',
            height: 'fit-content',
            position: 'absolute',
            minWidth: '350px',
            maxWidth: 'calc(100vw - 1rem)',
            top: isSmall ? 'unset' : 0,
            bottom: isSmall ? 0 : 'unset',
            left: isSmall ? 0 : '1rem',
            backgroundColor: '#3d3d3d',
            borderRadius: '0.25rem',
          }}
        >
          <div className="relative flex items-start justify-start -fit w-full">
            {isSmall && (
              <div id="close" className="absolute top-0 right-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    onClose()
                  }}
                >
                  <XIcon color="black" />
                </Button>
              </div>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
