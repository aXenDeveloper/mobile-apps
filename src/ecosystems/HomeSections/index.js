//import Post from './Post';
import NewContent from './NewContent';
import NewContentFragment from './NewContentFragment';
import OurPicks from './OurPicks';
import OurPicksFragment from './OurPicksFragment';

//export { Post as Post };
//export { NewContent as NewContent };
//export { NewContentFragment as NewContentFragment };

export const HomeSections = {
	new_content: {
		component: NewContent,
		fragment: NewContentFragment,
		fragmentName: 'NewContentFragment'
	},
	'our_picks': {
		component: OurPicks,
		fragment: OurPicksFragment,
		fragmentName: 'OurPicksFragment'
	},
	'online_users': {
		component: NewContent,
		fragment: NewContentFragment,
		fragmentName: 'NewContentFragment'
	}
};