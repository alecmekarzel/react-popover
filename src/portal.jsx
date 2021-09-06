import { createPortal } from 'react-dom'

export let RenderToBody = ({ children }) => {
	if (typeof window == 'undefined') return null
	return createPortal(children, document.body)
}
