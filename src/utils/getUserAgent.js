export default function getUserAgent() {
	if (Expo.Constants.platform.ios) {
		return `InvisionCommunityApp/${Expo.Constants.manifest.version} (iOS|${Expo.Constants.deviceName}|${Expo.Constants.platform.ios.platform}|${
			Expo.Constants.platform.ios.systemVersion
		})`;
	} else {
		return `InvisionCommunityApp/${Expo.Constants.manifest.version} (Android|${Expo.Constants.deviceName})`;
	}
}
