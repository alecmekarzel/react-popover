import { styled, keyframes } from 'goober';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import useDelayed from 'use-delayed';
import outsideClick from '@varld/outside-click';
import { RenderToBody } from './portal';

let Wrapper = styled('div', React.forwardRef)`
  z-index: 9999;
  pointer-events: none;

  &.open {
	pointer-events: all;
  }
`;

let Inner = styled('div')`
  opacity: 1;
`;

let fadeIn = keyframes`
  from {
	opacity: 0;
	margin-top: 0px;
  }

  to {
	opacity: 1;
	margin-top: 4px;
  }
`;

let fadeOut = keyframes`
  from {
	opacity: 1;
	margin-top: 4px;
  }

  to {
	opacity: 0;
	margin-top: 0px;
  }
`;

export let Popover = React.forwardRef(
	(
		{
			popover,
			children,
		}: {
			popover: (d: {
				visible: boolean;
				open: boolean;
				close: () => void;
			}) => React.ReactElement;
			children: React.ReactElement | React.ReactElement[];
		},
		ref: any
	) => {
		let [referenceElement, setReferenceElement] = useState(null) as any;
		let [popperElement, setPopperElement] = useState(null) as any;
		let { styles, attributes } = usePopper(referenceElement, popperElement);
		let [open, setOpen] = useState(false);
		let visible = useDelayed(open, 500, [true]);
		let close = useCallback(() => setOpen(false), [setOpen]);

		let popoverEl = popover({ visible, open, close });

		useEffect(() => {
			return outsideClick(
				[referenceElement, popperElement],
				() => setOpen(false),
				() => open
			);
		}, [referenceElement, popperElement, open]);

		useEffect(() => {
			if (!ref) ref = createRef();
			ref.current = { setOpen };
		}, [ref, setOpen]);

		return (
			<>
				<div
					tabIndex={0}
					ref={setReferenceElement}
					onClick={() => setOpen(!open)}
					style={{
						width: 'fit-content',
						height: 'fit-content',
					}}
					data-popover-anchor
				>
					{children}
				</div>

				{visible && (
					<RenderToBody>
						<Wrapper
							className={open ? 'open' : ''}
							ref={setPopperElement}
							style={styles.popper}
							{...attributes.popper}
						>
							<Inner
								style={{
									animation: `${open ? fadeIn : fadeOut
										} 0.1s ease-in-out forwards`,
								}}
							>
								{popoverEl}
							</Inner>
						</Wrapper>
					</RenderToBody>
				)}
			</>
		);
	}
);
