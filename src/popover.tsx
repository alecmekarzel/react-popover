import { styled, keyframes } from 'goober'
import React, { createRef, useCallback, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import outsideClick from '@alecmekarzel/outside-click'
import { RenderToBody } from './portal'
import { type Placement } from '@popperjs/core'

let Wrapper = styled('div', React.forwardRef)`
	z-index: 9998;
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

type PopoverProps = {
	element: (d: {
		visible: boolean;
		open: boolean;
		close: () => void;
	}) => React.ReactElement
	children: React.ReactElement | React.ReactElement[]
	placement?: Placement
}

export let Popover = React.forwardRef(
	({ element, children, placement = 'top' }: PopoverProps, ref: any) => {
		let [referenceElement, setReferenceElement] = useState(null) as any
		let [popperElement, setPopperElement] = useState(null) as any

		// Setup popper
		let { styles, attributes } = usePopper(
			referenceElement,
			popperElement,
			{
				placement,
				modifiers: [],
			}
		)

		let [open, setOpen] = useState(false)
		let visible = useDelayed(open, 500, [true])
		let close = useCallback(() => setOpen(false), [setOpen])

		let popoverEl = element({ visible, open, close }) // Take the element function, pass in props to function for next functional component

		useEffect(() => {
			return outsideClick(
				[referenceElement, popperElement],
				() => setOpen(false),
				() => open
			)
		}, [referenceElement, popperElement, open])

		useEffect(() => {
			if (!ref) ref = createRef()
			ref.current = { setOpen }
		}, [ref, setOpen])

		return (
			<>
				<div
					tabIndex={0}
					ref={setReferenceElement}
					onClick={() => setOpen(!open)}
					style={{
						width: 'fit-content',
						height: 'fit-content',
						display: 'inline-block',
						cursor: 'pointer',
						lineHeight: '0',
					}}
					data-popover-anchor
				>
					{children}
				</div>

				{visible && (
					<RenderToBody>
						<Wrapper
							className={open ? 'open' : ''}
							ref={setPopperElement}
							style={styles.popper}
							{...attributes.popper}
						>
							<Inner
								style={{
									animation: `${
										open ? fadeIn : fadeOut
									} 0.1s ease-in-out forwards`,
								}}
							>
								{popoverEl}
							</Inner>
						</Wrapper>
					</RenderToBody>
				)}
			</>
		)
	}
)
