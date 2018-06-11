/**
 * Node dependencies
 */
const path = require( 'path' );
const fs = require( 'fs' );
const lodash = require( 'lodash' );

/**
 * Generates the table of contents' markdown.
 *
 * @param {Object} parsed Parsed Namespace Object
 *
 * @return {string} Markdown string
 */
function generateTableOfContent( parsed ) {
	return [
		'# Data Module Reference',
		'',
		Object.values( parsed ).map( ( parsedNamespace ) => {
			return ` - [**${ parsedNamespace.name }**: ${ parsedNamespace.title }](./${ lodash.kebabCase( parsedNamespace.name ) }.md)`;
		} ).join( '\n' ),
	].join( '\n' );
}

/**
 * Generates the table of contents' markdown.
 *
 * @param {Object}  parsedFunc            Parsed Function
 * @param {boolean} generateDocsForReturn Whether to generate docs for the return value.
 *
 * @return {string} Markdown string
 */
function generateFunctionDocs( parsedFunc, generateDocsForReturn = true ) {
	return [
		`### ${ parsedFunc.name }`,
		'',
		parsedFunc.description,
		'',
		parsedFunc.params.length ? [
			'*Parameters*',
			'',
			parsedFunc.params.map( ( param ) => (
				` * ${ param.name }: ${ param.description }`
			) ).join( '\n' ),
		].join( '\n' ) : '',
		parsedFunc.return && generateDocsForReturn ? [
			'',
			'*Returns*',
			'',
			parsedFunc.return.description,
		].join( '\n' ) : '',
	].join( '\n' );
}

/**
 * Generates the namespace selectors/actions markdown.
 *
 * @param {Object} parsedNamespace Parsed Namespace
 *
 * @return {string} Markdown string
 */
function generateNamespaceDocs( parsedNamespace ) {
	return [
		`# **${ parsedNamespace.name }**: ${ parsedNamespace.title }`,
		'',
		'## Selectors ',
		'',
		( parsedNamespace.selectors.map( generateFunctionDocs ) ).join( '\n\n' ),
		'',
		'## Actions',
		'',
		parsedNamespace.actions.map(
			( action ) => generateFunctionDocs( action, false )
		).join( '\n\n' ),
	].join( '\n' );
}

module.exports = function( parsed, rootFolder ) {
	const tableOfContent = generateTableOfContent( parsed );
	fs.writeFileSync(
		path.join( rootFolder, 'index.md' ),
		tableOfContent
	);

	Object.values( parsed ).forEach( ( parsedNamespace ) => {
		const namespaceDocs = generateNamespaceDocs( parsedNamespace );
		fs.writeFileSync(
			path.join( rootFolder, lodash.kebabCase( parsedNamespace.name ) + '.md' ),
			namespaceDocs
		);
	} );
};
