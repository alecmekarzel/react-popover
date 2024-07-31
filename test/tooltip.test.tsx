import * as React from 'react'
import { Tooltip } from '../src'
import { render } from '@testing-library/react'

describe('tooltip', () => {
	it('renders without crashing', () => {
		render(
			<Tooltip element="I am a Tooltip">
				<button>Test</button>
			</Tooltip>
		)
	})
})
