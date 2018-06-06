/**
 * External dependencies
 */
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import { PostPreviewButton } from '../';

describe( 'PostPreviewButton', () => {
	describe( 'getWindowTarget()', () => {
		it( 'returns a string unique to the post id', () => {
			const instance = new PostPreviewButton( {
				postId: 1,
			} );

			expect( instance.getWindowTarget() ).toBe( 'wp-preview-1' );
		} );
	} );

	describe( 'componentDidUpdate()', () => {
		it( 'should change popup location if preview link is available', () => {
			const wrapper = shallow(
				<PostPreviewButton
					postId={ 1 }
					currentPostLink="https://wordpress.org/?p=1"
					isSaveable
					modified="2017-08-03T15:05:50" />
			);
			wrapper.instance().previewWindow = {};

			wrapper.setProps( { previewLink: 'https://wordpress.org/?p=1' } );

			expect(
				wrapper.instance().previewWindow.location
			).toBe( 'https://wordpress.org/?p=1' );
		} );
	} );

	describe( 'saveForPreview()', () => {
		function assertForSave( props, isExpectingSave ) {
			const autosave = jest.fn();
			const preventDefault = jest.fn();
			const windowOpen = window.open;
			window.open = jest.fn( () => {
				return {
					document: {
						write: jest.fn(),
						close: jest.fn(),
					},
				};
			} );

			const wrapper = shallow(
				<PostPreviewButton { ...props } autosave={ autosave } />
			);

			wrapper.simulate( 'click', { preventDefault } );

			if ( isExpectingSave ) {
				expect( autosave ).toHaveBeenCalled();
				expect( preventDefault ).toHaveBeenCalled();
				expect( window.open ).toHaveBeenCalled();
				expect( wrapper.instance().previewWindow.document.write ).toHaveBeenCalled();
			} else {
				expect( autosave ).not.toHaveBeenCalled();
				expect( preventDefault ).not.toHaveBeenCalled();
				expect( window.open ).not.toHaveBeenCalled();
			}

			window.open = windowOpen;
		}

		it( 'should do nothing if not dirty for saved post', () => {
			assertForSave( {
				postId: 1,
				isNew: false,
				isDirty: false,
				isSaveable: true,
			}, false );
		} );

		it( 'should save if not dirty for new post', () => {
			assertForSave( {
				postId: 1,
				isNew: true,
				isDirty: false,
				isSaveable: true,
			}, true );
		} );

		it( 'should open a popup window', () => {
			assertForSave( {
				postId: 1,
				isNew: true,
				isDirty: true,
				isSaveable: true,
			}, true );
		} );
	} );

	describe( 'render()', () => {
		it( 'should render a link', () => {
			const wrapper = shallow(
				<PostPreviewButton
					postId={ 1 }
					isSaveable
					currentPostLink="https://wordpress.org/?p=1" />
			);

			expect( wrapper.prop( 'href' ) ).toBe( 'https://wordpress.org/?p=1' );
			expect( wrapper.prop( 'disabled' ) ).toBe( false );
			expect( wrapper.prop( 'target' ) ).toBe( 'wp-preview-1' );
		} );

		it( 'should render with preview link as href if available', () => {
			const wrapper = shallow(
				<PostPreviewButton
					currentPostLink="https://wordpress.org/?p=1"
					previewLink="https://wordpress.org/?p=1&preview=true" />
			);

			expect( wrapper.prop( 'href' ) ).toBe( 'https://wordpress.org/?p=1&preview=true' );
		} );

		it( 'should be disabled if post is not saveable', () => {
			const wrapper = shallow(
				<PostPreviewButton
					postId={ 1 }
					currentPostLink="https://wordpress.org/?p=1" />
			);

			expect( wrapper.prop( 'disabled' ) ).toBe( true );
		} );
	} );
} );
