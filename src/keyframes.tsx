import { keyframes } from 'goober'

export let fadeIn = keyframes`
from {
	opacity: 0;
}

to {
	opacity: 1;
}
`

export let fadeOut = keyframes`
	from {
		opacity: 1;
	}

	to {
		opacity: 0;
	}
`

export let fadeDownIn = keyframes`
	from {
		opacity: 0;
		top: -6px;
	}

	to {
		opacity: 1;
		top: 0px;
	}
`

export let fadeDownOut = keyframes`
	from {
		opacity: 1;
		top: 0px;
	}

	to {
		opacity: 0;
		top: -6px;
	}
`

export let fadeRightIn = keyframes`
	from {
		opacity: 0;
		left: -6px;
	}

	to {
		opacity: 1;
		left: 0px;
	}
`

export let fadeRightOut = keyframes`
	from {
		opacity: 1;
		left: 0px;
	}

	to {
		opacity: 0;
		left: -6px;
	}
`

export let fadeLeftIn = keyframes`
	from {
		opacity: 0;
		right: -6px;
	}

	to {
		opacity: 1;
		right: 0px;
	}
`

export let fadeLeftOut = keyframes`
	from {
		opacity: 1;
		right: 0px;
	}

	to {
		opacity: 0;
		right: -6px;
	}
`

export let fadeUpIn = keyframes`
	from {
		opacity: 0;
		bottom: -6px;
	}

	to {
		opacity: 1;
		bottom: 0px;
	}
`

export let fadeUpOut = keyframes`
	from {
		opacity: 1;
		bottom: 0px;
	}

	to {
		opacity: 0;
		bottom: -6px;
	}
`
