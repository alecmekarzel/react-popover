import * as React from 'react'
import { Tooltip } from '../src'
import { render } from '@testing-library/react'

describe('tooltip', () => {
	it('renders without crashing', () => {
		render(
			<Tooltip content="I am a Tooltip">
				<button>Test</button>
			</Tooltip>
		)
	})
})
