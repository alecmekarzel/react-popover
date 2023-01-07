import outsideClick from '@alecmekarzel/outside-click'
import { styled } from 'goober'
import React, { createRef, useCallback, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import { fadeDownIn, fadeDownOut } from '../keyframes'
import { RenderTo } from './RenderTo'

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

		pinned: boolean
		pin: () => void
		unpin: () => void
	}) => React.ReactElement
	children: React.ReactElement | React.ReactElement[]
	placement?: 'top' | 'bottom' | 'left' | 'right'
	attachTo?: string
	alwaysPresent?: boolean
}

export let Popover = React.forwardRef(
	(
		{
			element,
			children,
			placement = 'top',
			attachTo,
			alwaysPresent = false,
		}: PopoverProps,
		ref: any
	) => {
		let [isPinned, setIsPinned] = useState(false)
		let [hasClicked, setHasClicked] = useState(false)
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
		let pin = useCallback(() => setIsPinned(true), [setIsPinned])
		let unpin = useCallback(() => setIsPinned(false), [setIsPinned])

		let popoverEl = element({
			visible,
			open,
			close,
			pin,
			unpin,
			pinned: isPinned,
		}) // Take the element function, pass in props to function for next functional component

		useEffect(() => {
			const allPopoverElements = Array.from(
				document.querySelectorAll('[data-popover-wrapper]')
			)

			return outsideClick(
				[referenceElement, popperElement, ...allPopoverElements],
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
					onClick={() => {
						setOpen(!open)
						setHasClicked(true)
					}}
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

				{visible || (hasClicked && alwaysPresent) || isPinned ? (
					<RenderTo selector={attachTo ? attachTo : document.body}>
						<Wrapper
							className={open || isPinned ? 'open' : ''}
							ref={setPopperElement}
							style={styles.popper}
							data-popover-wrapper
							{...attributes.popper}
						>
							<Inner
								style={{
									animation: `${
										open || isPinned
											? fadeDownIn
											: fadeDownOut
									} 0.1s ease-in-out forwards`,
								}}
							>
								{popoverEl}
							</Inner>
						</Wrapper>
					</RenderTo>
				) : null}
			</>
		)
	}
)
