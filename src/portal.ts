import { createPortal } from 'react-dom'

type RenderToBodyProps = {
	children: React.ReactElement | React.ReactElement[]
}

export let RenderToBody = ({ children }: RenderToBodyProps) => {
	if (typeof window == 'undefined') return null
	return createPortal(children, document.body)
}
