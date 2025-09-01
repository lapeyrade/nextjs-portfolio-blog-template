// Minimal rehype plugin to transform GitHub-style callouts
// Recognizes markers like [!NOTE], [!TIP], [!WARNING], [!IMPORTANT], [!CAUTION], [!INFO]

type HastNode = {
	type?: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
	value?: string;
};

const TYPE_MAP: Record<string, string> = {
	NOTE: "note",
	TIP: "tip",
	WARNING: "warning",
	IMPORTANT: "important",
	CAUTION: "caution",
	INFO: "info",
};

function isElement(node: HastNode | undefined, tag?: string): boolean {
	return !!node && node.type === "element" && (!tag || node.tagName === tag);
}

function ensureArrayClassName(props: Record<string, unknown> = {}) {
	const cn = props.className;
	if (!cn) return [] as string[];
	if (Array.isArray(cn)) return cn as string[];
	if (typeof cn === "string") return cn.split(/\s+/);
	return [] as string[];
}

export default function rehypeCallouts() {
	return function transform(tree: HastNode) {
		function walk(node: HastNode) {
			if (
				isElement(node, "blockquote") &&
				Array.isArray(node.children) &&
				node.children.length > 0
			) {
				const first = node.children?.[0];
				if (
					isElement(first, "p") &&
					Array.isArray(first?.children) &&
					(first?.children?.length ?? 0) > 0
				) {
					const firstChild = first.children?.[0];
					if (
						firstChild &&
						firstChild.type === "text" &&
						typeof firstChild.value === "string"
					) {
						const match = firstChild.value.match(
							/^\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|INFO)\]\s*/,
						);
						if (match) {
							const kind =
								TYPE_MAP[match[1] as keyof typeof TYPE_MAP] || "note";
							// Remove the marker from the text
							firstChild.value = firstChild.value.replace(match[0], "");
							node.properties = node.properties || {};
							const classNames = ensureArrayClassName(node.properties);
							node.properties.className = Array.from(
								new Set([...classNames, "callout", `callout-${kind}`]),
							);
						}
					}
				}
			}

			if (Array.isArray(node.children)) {
				for (const child of node.children) walk(child);
			}
		}

		walk(tree);
	};
}
