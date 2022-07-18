import { styled } from 'goober'
import React, { useEffect, useRef, useState } from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import outsideClick from '@alecmekarzel/outside-click'
import { RenderTo } from './RenderTo'
import { fadeIn, fadeOut } from '../keyframes'

let Wrapper = styled('div', React.forwardRef)`
	width: fit-content;
	z-index: 9999;
	pointer-events: none;
`

let Inner = styled('div')`
	position: relative;
`

type TooltipProps = {
	element: (d: { visible: boolean; open: boolean }) => React.ReactElement
	children: React.ReactNode
	placement?: any
	attachTo?: string
}

export let Tooltip = ({
	element,
	children,
	placement = 'top',
	attachTo,
}: TooltipProps) => {
	let [referenceElement, setReferenceElement] = useState(null) as any
	let [popperElement, setPopperElement] = useState(null) as any

	let { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement,
		modifiers: [],
	})

	let [open, setOpen] = useState(false)
	let visible = useDelayed(open, 500, [true])
	let enterToRef = useRef() as any

	let tooltipEl = element({ visible, open }) // Take the element function, pass in props to function for next functional component

	useEffect(() => {
		return outsideClick(
			[referenceElement, popperElement],
			() => setOpen(false),
			() => open
		)
	}, [referenceElement, popperElement, open])

	return (
		<>
			<div
				tabIndex={0}
				ref={setReferenceElement}
				onClick={() => {
					if (open) clearTimeout(enterToRef.current)
					setOpen(true)
				}}
				onMouseEnter={() => {
					clearTimeout(enterToRef.current)
					enterToRef.current = setTimeout(() => {
						setOpen(true)
					}, 100)
				}}
				onMouseLeave={() => {
					clearTimeout(enterToRef.current)
					setOpen(false)
				}}
				style={{
					width: 'fit-content',
					height: 'fit-content',
					display: 'inline-block',
				}}
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
									open ? fadeIn : fadeOut
								} 0.1s ease-in-out forwards`,
							}}
						>
							{tooltipEl}
						</Inner>
					</Wrapper>
				</RenderTo>
			)}
		</>
	)
}
