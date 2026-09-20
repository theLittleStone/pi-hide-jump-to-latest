import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const WIDGET_KEY = "pi-hide-jump-to-latest:sentinel";
const PATCH_FLAG = "__piHideJumpToLatest";

type TuiLike = {
	mode?: unknown;
	scrollToEndIndicator?: unknown;
	scrollToEndIndicatorRect?: unknown;
	compositeScrollToEndIndicator?: unknown;
};

/**
 * Pi 全屏 TUI 没有关闭 “Jump to latest message” 的公开 API。
 * 通过 0 行 widget 拿到 live TUI（Proxy），清掉内部 indicator，
 * 并补丁原型，避免切 TUI 模式后重建实例又把横幅加回来。
 */
function hideJumpToLatest(tui: unknown): void {
	if (!tui || typeof tui !== "object") return;

	const target = tui as TuiLike;
	if (target.mode !== "fullscreen") return;

	try {
		target.scrollToEndIndicator = undefined;
	} catch {
		return;
	}

	let proto: TuiLike | null;
	try {
		proto = Object.getPrototypeOf(tui) as TuiLike | null;
	} catch {
		return;
	}
	if (!proto || (proto as Record<string, unknown>)[PATCH_FLAG]) return;
	if (typeof proto.compositeScrollToEndIndicator !== "function") return;

	proto.compositeScrollToEndIndicator = function (screen: unknown) {
		try {
			(this as TuiLike).scrollToEndIndicatorRect = undefined;
		} catch {
			// ignore
		}
		return screen;
	};
	(proto as Record<string, unknown>)[PATCH_FLAG] = true;
}

export default function hideJumpToLatestExtension(pi: ExtensionAPI): void {
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.mode !== "tui") return;

		try {
			ctx.ui.setWidget(WIDGET_KEY, (tui) => {
				hideJumpToLatest(tui);
				return {
					invalidate() {},
					render() {
						hideJumpToLatest(tui);
						return [];
					},
				};
			});
		} catch {
			// setWidget 不存在或 TUI 形状变了时静默跳过，避免拖垮会话
		}
	});
}
