import { Match, Show, Switch, createContext } from "solid-js";

import TrackProgressBar from "./TrackProgressBar/TrackProgressBar";
import PastTracks from "./PastTracks/PastTracks";

import {
	FaBrandsLastfm,
	FaRegularUser,
	FaSolidCompactDisc
} from "solid-icons/fa";
import { SiMusicbrainz } from "solid-icons/si";

import disc from "./disc.svg";
import "../index.css";
import { lfmvHook, useLastfmViewer } from "./useLastfmViewer";
import { LastFmImage } from "./LFMtypes";
import { Image } from "./MBtypes";
import ErrorView from "./ErrorView/ErrorView";
import LoadingSkeleton from "./LoadingSkeleton/LoadingSkeleton";

import styles from "./SolidLastFMViewer.module.css";

export interface Colors {
	primary: string | undefined;
	secondary: string | undefined;
	accent: string | undefined;
}
export interface Props {
	api_key: string;
	user: string;
	updateInterval?: number;
}

export const lfmContext = createContext<lfmvHook>({
	track: {
		trackName: "",
		artistName: "",
		albumTitle: "",
		MBImages: undefined,
		lastfmImages: undefined,
		nowplaying: false,
		pastTracks: [],
		duration: 0
	},
	colors: undefined,
	loading: true,
	message: ""
});

const SolidLastFMViewer = ({ api_key, user, updateInterval }: Props) => {
	const state: lfmvHook = useLastfmViewer({
		api_key,
		user,
		updateInterval
	});
	return (
		<>
			{/* preconnects */}
			<link href="https://lastfm.freetls.fastly.net" rel="preconnect" />
			<link href="https://archive.org" rel="preconnect" />
			<link href="https://coverartarchive.org" rel="preconnect" />
			<link href="http://coverartarchive.org" rel="preconnect" />
			<link href="https://musicbrainz.org" rel="preconnect" />
			<link href="http://ws.audioscrobbler.com" rel="preconnect" />
			{/* preconnects */}
			<lfmContext.Provider value={state}>
				<div
					class={
						styles.lfmvCard +
						" glass relative mx-auto box-border flex h-full w-full flex-col rounded-lg p-4 shadow-xl ring-2 ring-slate-950/5"
					}
					style={{ background: state.colors?.primary }}
				>
					{state.track instanceof Error ? (
						<Show when={state.message}>
							{<ErrorView message={state.message as string} />}
						</Show>
					) : (
						<>
							<figure
								class="mx-auto mb-2 h-auto overflow-hidden rounded-lg border-inherit"
								style={{
									"box-shadow": `0 0 20px ${state.colors?.secondary}99`
								}}
							>
								<Switch
									fallback={
										<LoadingSkeleton
											class="mx-auto h-[300px] w-[300px]"
											fallback={
												<img
													src={disc}
													class=""
													alt="Default album cover thumbnail"
												/>
											}
										>
											{null}
										</LoadingSkeleton>
									}
								>
									<Match when={state.track?.lastfmImages}>
										<img
											class="block h-full w-full overflow-hidden object-cover align-middle"
											src={
												(
													state.track
														?.lastfmImages as LastFmImage[]
												)[3]["#text"]
											}
											alt="Album Cover"
										/>
									</Match>
									<Match when={state.track?.MBImages}>
										<img
											class="block h-full w-full overflow-hidden object-cover align-middle"
											src={
												(
													state.track
														?.MBImages as Image[]
												)[0].image
											}
											alt="Album Cover"
										/>
									</Match>
								</Switch>
							</figure>

							<div class="flex h-min flex-col gap-1 drop-shadow-lg filter">
								<LoadingSkeleton
									class="mx-auto h-[40px] w-[90%]"
									fallback={null}
								>
									{state.track?.nowplaying && (
										<TrackProgressBar />
									)}
								</LoadingSkeleton>
								<h1
									class="shadow:lg mx-auto mt-1 text-center text-xs font-bold sm:text-base"
									style={{ color: state.colors?.secondary }}
								>
									<LoadingSkeleton
										class="mx-auto h-3 w-1/2"
										fallback="Track title not available"
									>
										{state.track?.trackName}
									</LoadingSkeleton>
								</h1>
								<div
									style={{ color: state.colors?.secondary }}
									class="flex flex-col gap-2 text-xs"
								>
									<LoadingSkeleton
										class="mx-auto h-3 w-1/2"
										fallback="Artist name not available"
									>
										{
											<span class="flex items-center justify-center gap-1">
												<FaRegularUser />
												{state.track?.artistName}
											</span>
										}
									</LoadingSkeleton>
									<LoadingSkeleton
										class="mx-auto h-3 w-1/2"
										fallback="Album name not available"
									>
										{state.track?.albumTitle ? (
											<span class="flex items-center justify-center gap-1">
												<FaSolidCompactDisc />
												{state.track?.albumTitle}
											</span>
										) : null}
									</LoadingSkeleton>
								</div>
								<PastTracks />
								<div
									style={{ color: state.colors?.secondary }}
									class="mt-2 flex  w-full justify-between drop-shadow-lg filter"
								>
									<span class="flex gap-2">
										<a
											href="https://www.last.fm/"
											target="_blank"
											class="h-min self-center "
										>
											<FaBrandsLastfm />
										</a>
										<a
											href="https://musicbrainz.org/"
											target="_blank"
										>
											<SiMusicbrainz />
										</a>
									</span>
									<a
										class=" flex items-center gap-2 text-xs"
										href={`https://www.last.fm/user/${user}`}
									>
										<FaRegularUser />
										{user}
									</a>
								</div>
							</div>
						</>
					)}
				</div>
			</lfmContext.Provider>
		</>
	);
};

export default SolidLastFMViewer;
