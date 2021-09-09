import { keyframes, styled } from 'goober'
import React, { useEffect, useRef, useState } from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import outsideClick from '@alecmekarzel/outside-click'

let Wrapper = styled('div', React.forwardRef)`
	width: fit-content;
	z-index: 9999;
	pointer-events: none;

	&.open {
		pointer-events: all;
	}
`

let Inner = styled('div')`
	color: black;
	font-size: 0.8em;
	font-weight: 500;
	background: white;
	padding: 6px 10px;
	border: solid #efefef 1px;
	border-radius: 5px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
`

let fadeIn = keyframes`
	from {
		opacity: 0;
		margin-top: -5px;
	}

	to {
		opacity: 1;
		margin-top: 0px;
	}
`

let fadeOut = keyframes`
	from {
		opacity: 1;
		margin-top: 0px;
	}

	to {
		opacity: 0;
		margin-top: -5px;
	}
`

export let Tooltip = ({ content, children }) => {
	let [referenceElement, setReferenceElement] = useState(null)
	let [popperElement, setPopperElement] = useState(null)

	let { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: 'top',
		modifiers: []
	})
	
	let [open, setOpen] = useState(false)
	let visible = useDelayed(open, 500, [true])
	let enterToRef = useRef()

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
				}}
			>
				{children}
			</div>

			{visible && (
				<Wrapper
					className={open ? 'open' : ''}
					ref={setPopperElement}
					style={styles.popper}
					{...attributes.popper}
				>
					<Inner
						style={{
							animation: `${open ? fadeIn : fadeOut} 0.1s ease-in-out forwards`,
						}}
					>
						{content}
					</Inner>
				</Wrapper>
			)}
		</>
	)
}
