import { styled, keyframes } from 'goober'
import React, { createRef, useMemo, useCallback, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import outsideClick from '@alecmekarzel/outside-click'
import { RenderToBody } from './portal'

let Shadow = styled('div', React.forwardRef)`
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
	position: fixed;
	top: 0;
	left: 0;

	z-index: 9998;
`
let Wrapper = styled('div', React.forwardRef)`
	z-index: 9999;
	pointer-events: none;

	&.open {
		pointer-events: all;
	}
`

let Inner = styled('div')`
	opacity: 1;
	position: relative;
`

let fadeIn = keyframes`
	from {
		opacity: 0;
		top: -8px;
	}

	to {
		opacity: 1;
		top: -4px;
	}
`

let fadeOut = keyframes`
	from {
		opacity: 1;
		top: -4px;
	}

	to {
		opacity: 0;
		top: -8px;
	}
`

export let Popup = React.forwardRef(({ element, children, }, ref) => {
		let [referenceElement, setReferenceElement] = useState(null)
		let [popperElement, setPopperElement] = useState(null)

		const customModifier = useMemo(() => ({
			name: 'computeStyles',
			enabled: true,
			fn({state}) {
				state.styles.popper = {
					...state.styles.popper,
					position: 'fixed',
					left: `${(window.innerWidth - state.rects.popper.width) / 2}px`,
					top: '50%',
					transform: 'translateY(-50%)',
				}
		
				return state
			},
		}), [])

		let { styles, attributes } = usePopper(referenceElement, popperElement, {
			modifiers: [customModifier]
		})
		
		let [open, setOpen] = useState(false)
		let visible = useDelayed(open, 500, [true])
		let close = useCallback(() => setOpen(false), [setOpen])

		let popupEl = element({ visible, open, close })

		useEffect(() => {
			return outsideClick(
				[referenceElement, popperElement],
				() => setOpen(false), // set open to false on outside click
				() => open // determine whether popup is enabled
			)
		}, [referenceElement, popperElement, open])

		useEffect(() => {
			// if there's no ref, create one
			if (!ref) ref = createRef()
			ref.current = { setOpen }
		}, [ref, setOpen])

		return (
			<>
				<div tabIndex={0} ref={setReferenceElement}
					onClick={() => setOpen(!open)}
					style={{
						width: 'fit-content',
						height: 'fit-content',
					}}
					data-popover-anchor>
					{children}
				</div>

				{visible && (
					<RenderToBody>
						<Shadow style={{ animation: `${open ? fadeIn : fadeOut} 0.1s ease-in-out forwards` }}/>
						<Wrapper className={open ? 'open' : ''} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
							<Inner style={{ animation: `${open ? fadeIn : fadeOut} 0.1s ease-in-out forwards` }}>
								{popupEl}
							</Inner>
						</Wrapper>
					</RenderToBody>
				)}
			</>
		)
	}
)
