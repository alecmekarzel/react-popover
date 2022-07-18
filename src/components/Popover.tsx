import { styled } from 'goober'
import React, { createRef, useCallback, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import outsideClick from '@alecmekarzel/outside-click'
import { RenderTo } from './RenderTo'
import { fadeDownIn, fadeDownOut } from '../keyframes'

let Wrapper = styled('div', React.forwardRef)`
	z-index: 9998;
	pointer-events: none;

	&.open {
		pointer-events: all;
	}
`

let Inner = styled('div')`
	position: relative;
`

type PopoverProps = {
	element: (d: {
		visible: boolean
		open: boolean
		close: () => void
	}) => React.ReactElement
	children: React.ReactElement | React.ReactElement[]
	placement?: any
	attachTo?: string
}

export let Popover = React.forwardRef(
	(
		{ element, children, placement = 'top', attachTo }: PopoverProps,
		ref: any
	) => {
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
						lineHeight: '0',
					}}
					data-popover-anchor
				>
					{children}
				</div>

				{visible && (
					<RenderTo selector={attachTo ? attachTo : document.body}>
						<Wrapper
							className={open ? 'open' : ''}
							ref={setPopperElement}
							style={styles.popper}
							{...attributes.popper}
						>
							<Inner
								style={{
									animation: `${
										open ? fadeDownIn : fadeDownOut
									} 0.1s ease-in-out forwards`,
								}}
							>
								{popoverEl}
							</Inner>
						</Wrapper>
					</RenderTo>
				)}
			</>
		)
	}
)
