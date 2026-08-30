import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	staticFile,
	Sequence,
} from 'remotion';

const Title: React.FC<{text: string; opacity: number; y: number}> = ({
	text,
	opacity,
	y,
}) => {
	return (
		<div
			style={{
				position: 'absolute',
				top: '45%',
				width: '100%',
				textAlign: 'center',
				fontSize: '80px',
				fontWeight: '700',
				color: 'white',
				textShadow: '0 10px 30px rgba(0,0,0,0.5)',
				fontFamily: 'system-ui, -apple-system, sans-serif',
				opacity,
				transform: `translateY(${y}px)`,
				padding: '0 100px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					background: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
					padding: '40px 60px',
					borderRadius: '30px',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
				}}
			>
				{text}
			</div>
		</div>
	);
};

export const WaterScarcity: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {
			damping: 100,
		},
	});

	const scale = interpolate(frame, [0, 450], [1, 1.2], {
		extrapolateRight: 'clamp',
	});

	// Scene Timings (Total 450 frames / 15 sec)
	// Scene 1: 0 - 100
	// Scene 2: 100 - 220
	// Scene 3: 220 - 340
	// Scene 4: 340 - 450

	const scene1Opacity = interpolate(frame, [0, 20, 80, 100], [0, 1, 1, 0]);
	const scene1Y = interpolate(frame, [0, 20], [50, 0]);

	const scene2Opacity = interpolate(frame, [100, 120, 200, 220], [0, 1, 1, 0]);
	const scene2Y = interpolate(frame, [100, 120], [50, 0]);

	const scene3Opacity = interpolate(frame, [220, 240, 320, 340], [0, 1, 1, 0]);
	const scene3Y = interpolate(frame, [220, 240], [50, 0]);

	const scene4Opacity = interpolate(frame, [340, 360, 430, 450], [0, 1, 1, 0]);
	const scene4Y = interpolate(frame, [340, 360], [50, 0]);

	return (
		<AbsoluteFill style={{backgroundColor: 'black', overflow: 'hidden'}}>
			{/* Background Image with slight zoom */}
			<div
				style={{
					transform: `scale(${scale})`,
					width: '100%',
					height: '100%',
				}}
			>
				<Img
					src={staticFile('water_scarcity_bg.png')}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</div>

			{/* Audio */}
			<Audio src={staticFile('water_scarcity_vo.wav')} />

			{/* Overlay Vignette */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
				}}
			/>

			{/* Scenes */}
			<Sequence from={0} durationInFrames={100}>
				<Title text="Water is the essence of life..." opacity={scene1Opacity} y={scene1Y} />
			</Sequence>

			<Sequence from={100} durationInFrames={120}>
				<Title text="Yet billions face scarcity every single day." opacity={scene2Opacity} y={scene2Y} />
			</Sequence>

			<Sequence from={220} durationInFrames={120}>
				<Title text="A world without clean water is a world without a future." opacity={scene3Opacity} y={scene3Y} />
			</Sequence>

			<Sequence from={340} durationInFrames={110}>
				<div
					style={{
						position: 'absolute',
						top: '40%',
						width: '100%',
						textAlign: 'center',
						opacity: scene4Opacity,
						transform: `translateY(${scene4Y}px)`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
					}}
				>
					<div
						style={{
							background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
							padding: '40px 80px',
							borderRadius: '50px',
							fontSize: '90px',
							fontWeight: '900',
							color: 'white',
							boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
							textTransform: 'uppercase',
							letterSpacing: '2px',
						}}
					>
						Save Water Today
					</div>
					<div
						style={{
							fontSize: '50px',
							color: 'white',
							fontWeight: '500',
							textShadow: '0 5px 15px rgba(0,0,0,0.5)',
						}}
					>
						For a Better Tomorrow. Every Drop Counts.
					</div>
				</div>
			</Sequence>

			{/* Progress Bar at bottom */}
			<div
				style={{
					position: 'absolute',
					bottom: '50px',
					left: '100px',
					right: '100px',
					height: '10px',
					background: 'rgba(255,255,255,0.1)',
					borderRadius: '10px',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${(frame / 450) * 100}%`,
						height: '100%',
						background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
						boxShadow: '0 0 20px #00c6ff',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
