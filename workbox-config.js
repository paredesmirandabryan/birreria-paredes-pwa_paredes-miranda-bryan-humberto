module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{js,html,json,svg,png,jpg,jpeg,webp,css}'
	],
	// Archivos que NO son parte de la app: no se guardan en la caché
	globIgnores: [
		'**/node_modules/**/*',
		'servidor-ssr*/**/*',
		'docs/**/*',
		'**/*.report.html',
		'reporte-lighthouse*.html',
		'workbox-config.js'
	],
	swDest: 'sw.js',
	// Activa el Service Worker nuevo de inmediato
	skipWaiting: true,
	clientsClaim: true,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};