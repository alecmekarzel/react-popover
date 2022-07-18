import { createPortal } from 'react-dom'

type RenderToProps = {
	children: React.ReactElement | React.ReactElement[]
	body?: boolean
	selector?: string | HTMLElement
}

export let RenderTo = ({ children, selector }: RenderToProps) => {
	if (typeof window == 'undefined') return null
	if (typeof children == 'undefined')
		throw Error('RenderTo component missing children')

	if (!selector) {
		return createPortal(children, document.body)
	} else {
		if (typeof selector === 'string') {
			const element = document.querySelector(selector)

			if (!element) return createPortal(children, document.body)
			else return createPortal(children, element)
		} else if (selector instanceof HTMLElement) {
			return createPortal(children, selector)
		} else {
			throw Error(
				'RenderTo selector prop is invalid, must be a string or HTMLElement'
			)
		}
	}
}
