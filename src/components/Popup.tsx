import { styled } from 'goober'
import React, {
	createRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { usePopper } from 'react-popper'
import useDelayed from 'use-delayed'
import { fadeDownIn, fadeDownOut, fadeIn, fadeOut } from '../keyframes'
import { RenderTo } from './RenderTo'

let Shadow = styled('div')`
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	position: fixed;
	top: 0;
	left: 0;

	z-index: 9996;
`
let Wrapper = styled('div', React.forwardRef)`
	z-index: 9997;
	pointer-events: none;

	&.open {
		pointer-events: all;
	}
`

let Inner = styled('div')`
	position: relative;
`

type PopupProps = {
	element: (d: {
		visible: boolean
		open: boolean
		close: () => void
	}) => React.ReactElement
	children: React.ReactElement | React.ReactElement[]
	attachTo?: string
	style?: any
}

export let Popup = React.forwardRef(
	({ element, children, attachTo, style }: PopupProps, ref: any) => {
		let [referenceElement, setReferenceElement] = useState(null) as any
		let [popperElement, setPopperElement] = useState(null) as any

		const customModifier = useMemo(
			() => ({
				name: 'computeStyles',
				enabled: true,
				fn({ state }: { state: any }) {
					if (style) {
						state.styles.popper = {
							...state.styles.popper,
							...style,
						}
					} else {
						state.styles.popper = {
							...state.styles.popper,
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}
					}

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

		let popupEl = element({ visible, open, close })

		useEffect(() => {
			// if there's no ref, create one
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
										open ? fadeDownIn : fadeDownOut
									} 0.1s ease-in-out forwards`,
								}}
							>
								{popupEl}
							</Inner>
						</Wrapper>
					</RenderTo>
				)}
			</>
		)
	}
)
