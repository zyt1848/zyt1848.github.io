// add by zyt   date: 2022-11-16
(function() {
	var menuItemTraslate = function(item) {
		var dict = {
			categories: '分类',
			tags: '标签',
			posts: '文章',
			about: '关于',
			link: '友链'
		};
		return dict[item.toLowerCase()];
	}
	return menuItemTraslate;
})();