import Vue from 'vue';

Vue.directive('tableFit', {
	/** 指令所在组件的 VNode 及其子 VNode 全部更新后调用。*/
	componentUpdated(el, binding, vnode) {
		setTimeout(() => {
			adjustColumnWidth(el, vnode);
		}, 0);
	}
});

/** 设置样式 */
function adjustColumnWidth(table, vnode) {
	// 中文英文和全角正则
	const CN = new RegExp('[\u4E00-\u9FA5]|[\uFF00-\uFFFF]');
	const NUM = new RegExp('[0-9]');
	// 中文和全角字体的像素宽度比例
	const CN_RATE = 1.1;
	// 数字字体的像素宽度比例
	const NUM_RATE = 0.6;
	// 其他字体的像素宽度比例
	const OTHER_RATE = 0.7;

	const columns = vnode.child.columns.slice();
	// 忽略序号、多选框
	for (let i = columns.length - 1; i >= 0; i--) {
		// 如果需忽略已设置宽的表头 加上columns[i].width ||
		if (columns[i].width || columns[i].type === 'index' || columns[i].type === 'selection') {
			columns.splice(i, 1);
		}
	}

	const colDefs = columns.map((item) => item.id);
	// 设置每列宽度
	colDefs.forEach((clsName, index) => {
		// colgroup中 和 表头标签的class名相同  通过class寻找相同列
		const cells = [
			// ...table.querySelectorAll(`.el-table__body-wrapper td.${clsName}`),
			...table.querySelectorAll(`th.${clsName}`)
		];
		const cellsBody = [...table.querySelectorAll(`.el-table__body-wrapper td.${clsName}`)];
		const widthList = cells.map((el) => {
			const cell = el.querySelector('.cell');
			if (cell) {
				// eslint-disable-next-line radix
				let fontSize = parseInt(window.getComputedStyle(cell, null).fontSize);
				fontSize = fontSize ? fontSize : 14;
				// 处理多行内容取最大宽度
				const strList = cell.innerText.split('\n');
				const strWidth = strList.map((item) => {
					let width = 0;
					// 计算每个字符的宽度
					for (const str of item) {
						if (CN.test(str)) {
							width += fontSize * CN_RATE;
						} else if (NUM.test(str)) {
							width += fontSize * NUM_RATE;
						} else {
							width += fontSize * OTHER_RATE;
						}
					}

					return Math.ceil(width);
				});

				return Math.max(...strWidth);
			}

			return 0;
		});
		// 取一列中的最大宽度
		const max = Math.max(...widthList);
		if (max !== 0) {
			let num = 0;
			// 在表格数据中设置minWidth 防止尺寸变化重新计算原来的宽度
			if (max < 260) {
				num = 260;
			}

			if (max < 170) {
				num = 170;
			}

			if (max < 80) {
				num = 150;
			}

			if (max < 60) {
				num = 120;
			}

			if (max < 20) {
				num = 50;
			}

			columns[index].minWidth = num;
			table.querySelectorAll(`col[name=${clsName}]`).forEach((el) => {
				// el.style.width = num + 'px'
				el.setAttribute('width', `${num}px`);
			});
		}
	});

	// 设置完后调用el-table方法更新布局
	vnode.child.doLayout();
	// tableRevise(table)
}

/** 修正el-table错位 */
function tableRevise(table) {
	const tableWrapper = table.querySelector('.el-table__body-wrapper');
	const tableBody = table.querySelector('.el-table__body');
	const colgroup = table.querySelector('colgroup');
	/**
	 * (以下数值为滚动条高度，可以自己根据情况通过class重新修改)
	 */
	// 内容大于容器时
	if (tableBody.clientWidth > tableWrapper.offsetWidth) {
		// 设置x轴滚动
		tableWrapper.style.overflowX = 'auto';
		// 解决固定列错位 （没有错位的可以忽略以下内容）
		const fixedWrap = table.querySelectorAll('.el-table .el-table__fixed-body-wrapper');
		if (fixedWrap.length > 0) {
			fixedWrap.forEach((item) => {
				item.style.paddingBottom = `${8}px`;
			});
		}

		// 解决固定列覆盖滚动条
		const fixedLeft = table.querySelector('.el-table .el-table__fixed');
		const fixedRight = table.querySelector('.el-table .el-table__fixed-right');
		if (fixedLeft) {
			fixedLeft.style.height = 'calc(100% - 8px)';
		}

		if (fixedRight) {
			fixedRight.style.height = 'calc(100% - 8px)';
		}

		// 解决表头偏移
		// 没有原生的gutter时自己新增一个
		const gutter = colgroup.querySelector('col[name=gutter]');
		const gutterx = colgroup.querySelector('col[name=gutterx]');
		if (!gutter && !gutterx) {
			const col = document.createElement('col');
			col.setAttribute('name', 'gutterx');
			col.setAttribute('width', '8');
			colgroup.appendChild(col);
		}
	}
}

// export { tableFit };
