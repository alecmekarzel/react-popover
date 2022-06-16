import * as React from 'react'
import { Popover } from '../src'
import { render } from '@testing-library/react'

describe('popover', () => {
	it('renders without crashing', () => {
		render(
			<Popover element={() => <div>I am a Popover</div>}>
				<button>Test</button>
			</Popover>
		)
	})
})
