Object.defineProperty(exports, '__esModule', { value: !0 });
var e = require('react/jsx-runtime'),
	i = require('react'),
	r = function () {
		return (r =
			Object.assign ||
			function (e) {
				for (var i, r = 1, t = arguments.length; r < t; r++)
					for (var o in (i = arguments[r])) Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o]);
				return e;
			}).apply(this, arguments);
	};
function t(e, i) {
	switch (i.type) {
		case 'collapse':
			return { collapse: !e.collapse };
		case 'show':
			return { collapse: !0 };
		default:
			return e;
	}
}
exports.Accordion = function (o) {
	var n,
		a = o.title,
		s = void 0 === a ? 'Accordion Title' : a,
		c = o.show,
		l = void 0 !== c && c,
		d = o.children,
		u = i.useRef(null),
		p = i.useReducer(t, { collapse: l }),
		h = p[0].collapse,
		v = p[1],
		m = i.useRef(window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36));
	return (
		i.useEffect(
			function () {
				l && v({ type: 'show' });
			},
			[l]
		),
		e.jsxs(
			'div',
			r(
				{ className: 'accordion-item' },
				{
					children: [
						e.jsx(
							'h2',
							r(
								{ className: 'accordion-header', id: 'heading-' + m.current },
								{
									children: e.jsx(
										'button',
										r(
											{
												className: 'accordion-button' + (h ? '' : ' collapsed'),
												type: 'button',
												'aria-expanded': h,
												'aria-controls': 'collapse-' + m.current,
												onClick: function () {
													return v({ type: 'collapse' });
												},
											},
											{ children: s }
										),
										void 0
									),
								}
							),
							void 0
						),
						e.jsx(
							'div',
							r(
								{
									id: 'collapse-' + m.current,
									'aria-labelledby': 'heading-' + m.current,
									className: 'accordion-collapse',
									style: h
										? {
												height:
													null === (n = u.current) || void 0 === n ? void 0 : n.clientHeight,
												transition: 'height 0.5s ease',
												overflow: 'hidden',
										  }
										: {
												height: 0,
												transition: 'height 0.5s ease',
												overflow: 'hidden',
										  },
								},
								{
									children: e.jsx(
										'div',
										r(
											{
												className: 'accordion-body',
												ref: u,
											},
											{ children: d || 'House of Bhemu' }
										),
										void 0
									),
								}
							),
							void 0
						),
					],
				}
			),
			void 0
		)
	);
};
// # sourceMappingURL=index.js.map
