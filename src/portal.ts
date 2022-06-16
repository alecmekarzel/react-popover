import { createPortal } from 'react-dom'

type RenderToProps = {
	children: React.ReactElement | React.ReactElement[]
	body?: boolean
	custom?: HTMLElement
}

export let RenderTo = ({ children, custom = document.body }: RenderToProps) => {
	if (typeof window == 'undefined') return null
	return createPortal(children, custom)
}
