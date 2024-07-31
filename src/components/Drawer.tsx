import { styled } from 'goober'
import React, {
	createRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import useDelayed from 'use-delayed'
import { RenderTo } from './RenderTo'
import {
	fadeIn,
	fadeOut,
	fadeDownIn,
	fadeDownOut,
	fadeLeftIn,
	fadeLeftOut,
	fadeRightIn,
	fadeRightOut,
	fadeUpIn,
	fadeUpOut,
} from '../keyframes'
import { usePopper } from 'react-popper'

let Shadow = styled('div')`
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	position: fixed;
	top: 0;
	left: 0;

	z-index: 9994;
`
let Wrapper = styled('div', React.forwardRef)`
	z-index: 9995;
	pointer-events: none;

	&.open {
		pointer-events: all;
	}
`

let Inner = styled('div')`
	position: relative;
`

type DrawerProps = {
	element: (d: {
		visible: boolean
		open: boolean
		close: () => void
	}) => React.ReactElement
	children: React.ReactElement | React.ReactElement[]
	placement?: 'top' | 'bottom' | 'left' | 'right'
	attachTo?: string
}

export let Drawer = React.forwardRef(
	(
		{ element, children, placement = 'left', attachTo }: DrawerProps,
		ref: any
	) => {
		let [referenceElement, setReferenceElement] = useState(null) as any
		let [popperElement, setPopperElement] = useState(null) as any

		const customModifier = useMemo(
			() => ({
				name: 'computeStyles',
				enabled: true,
				fn({ state }: { state: any }) {
					let styles

					if (placement === 'top') {
						styles = {
							position: 'absolute',
							top: '0',
							right: '0',
							left: '0',
						}
					} else if (placement === 'bottom') {
						styles = {
							position: 'absolute',
							bottom: '0',
							right: '0',
							left: '0',
						}
					} else if (placement === 'left') {
						styles = {
							position: 'absolute',
							left: '0',
							top: '0',
							bottom: '0',
						}
					} else if (placement === 'right') {
						styles = {
							position: 'absolute',
							right: '0',
							top: '0',
							bottom: '0',
						}
					}

					state.styles.popper = styles

					return state
				},
			}),
			[]
		)

		let { styles, attributes } = usePopper(
			referenceElement,
			popperElement,
			{
				modifiers: [customModifier],
			}
		)

		let [open, setOpen] = useState(false)
		let visible = useDelayed(open, 500, [true])
		let close = useCallback(() => setOpen(false), [setOpen])

		let drawerEl = element({ visible, open, close })

		useEffect(() => {
			// if there's no ref, create one
			if (!ref) ref = createRef()
			ref.current = { setOpen }
		}, [ref, setOpen])

		let animIn
		let animOut

		if (placement === 'top') {
			animIn = fadeDownIn
			animOut = fadeDownOut
		} else if (placement === 'bottom') {
			animIn = fadeUpIn
			animOut = fadeUpOut
		} else if (placement === 'left') {
			animIn = fadeRightIn
			animOut = fadeRightOut
		} else if (placement === 'right') {
			animIn = fadeLeftIn
			animOut = fadeLeftOut
		}

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
					}}
					data-popover-anchor
				>
					{children}
				</div>

				{visible && (
					<RenderTo selector={attachTo ? attachTo : document.body}>
						<Shadow
							onClick={() => setOpen(false)}
							style={{
								animation: `${
									open ? fadeIn : fadeOut
								} 0.1s ease-in-out forwards`,
							}}
						/>
						<Wrapper
							className={open ? 'open' : ''}
							ref={setPopperElement}
							style={styles.popper}
							{...attributes.popper}
						>
							<Inner
								style={{
									animation: `${
										open ? animIn : animOut
									} 0.25s ease-in-out forwards`,
								}}
							>
								{drawerEl}
							</Inner>
						</Wrapper>
					</RenderTo>
				)}
			</>
		)
	}
)
