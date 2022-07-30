export interface ServiceOptions {}

/**
 * An identity function for {@link ServiceOptions}.
 */
export function service<T extends ServiceOptions>(options: T): T {
	return options;
}
