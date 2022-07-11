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
	color: white;
	font-size: 0.8em;
	font-weight: 500;
	background: rgba(0, 0, 0, 0.8);
	padding: 6px 9px;
	border-radius: 3px;
	margin: 4px;
`

type TooltipProps = {
	content: string
	children: React.ReactNode
	placement?: any
	attachTo?: HTMLElement
}

export let Tooltip = ({
	content,
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
				<RenderTo custom={attachTo ? attachTo : document.body}>
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
							{content}
						</Inner>
					</Wrapper>
				</RenderTo>
			)}
		</>
	)
}
