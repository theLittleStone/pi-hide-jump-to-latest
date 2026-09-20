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
 * Pi fullscreen TUI has no public switch for the Jump to latest message overlay.
 * A zero-height widget captures the live TUI proxy, clears the indicator field,
 * and patches the prototype so TUI mode switches do not restore the banner.
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
			// Skip if setWidget is missing or the TUI shape changed.
		}
	});
}
