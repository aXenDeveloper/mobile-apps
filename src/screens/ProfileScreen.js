import React, { Component } from 'react';
import { Text, View, ScrollView, SectionList, StyleSheet, Image, StatusBar } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import HeaderBackButton from 'react-navigation';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import ListItem from '../atoms/ListItem';
import SectionHeader from '../ecosystems/SectionHeader';
import relativeTime from '../utils/RelativeTime';
import UserPhoto from '../atoms/UserPhoto';
import CustomHeader from '../ecosystems/CustomHeader';

const ProfileQuery = gql`
	query ProfileQuery($member: ID!) {
		core {
			member (id: $member) {
				id
				name
				email
				photo
				contentCount
				reputationCount
				followerCount
				joined
				group {
					name
				}
				coverPhoto {
					image
					offset
				}
				customFieldGroups {
					id
					title
					fields {
						id
						title
						value
						type
					}
				}
			}
		}
	}
`;

class ProfileScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		header: (props) => {
			return (
				<CustomHeader transparent {...props} />
			)
		},
	});
	
	render() {
		if( this.props.data.loading ){
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else {

			const customFields = [];

			customFields.push({
				title: 'Basic Information',
				data: [
					{
						key: 'joined',
						data: {
							id: 'joined',
							title: 'Joined',
							value: relativeTime.long(this.props.data.core.member.joined),
							html: false
						}
					}
				]
			});

			if( this.props.data.core.member.customFieldGroups.length ){
				this.props.data.core.member.customFieldGroups.map( (group) => {
					customFields.push({
						title: group.title,
						data: group.fields.map( (field) => ({
							key: field.id,
							data: {
								id: field.id,
								title: field.title,
								value: field.value,
								html: ( field.type == 'Editor' )
							}
						}))
					}); 
				});
			}

			return (
				<ScrollView style={{flex: 1}}>
					<StatusBar barStyle="light-content" translucent />
					<View style={styles.profileHeader}>
						{this.props.data.core.member.coverPhoto.image ?
							<Image source={{ uri: this.props.data.core.member.coverPhoto.image }} style={styles.coverPhoto} resizeMode='cover' />
						: null}
						<View style={styles.profileHeaderInner}>
							<UserPhoto url={this.props.data.core.member.photo} size={80} />
							<Text style={styles.usernameText}>{this.props.data.core.member.name}</Text>
							<Text style={styles.groupText}>{this.props.data.core.member.group.name}</Text>
						</View>
					</View>
					<View style={styles.profileStats}>
						<View style={[styles.profileStatSection, styles.profileStatSectionBorder]}>
							<Text style={styles.profileStatCount}>{this.props.data.core.member.contentCount}</Text>
							<Text style={styles.profileStatTitle}>Content Count</Text>
						</View>
						<View style={[styles.profileStatSection, styles.profileStatSectionBorder]}>
							<Text style={styles.profileStatCount}>{this.props.data.core.member.reputationCount}</Text>
							<Text style={styles.profileStatTitle}>Reputation</Text>
						</View>
						<View style={styles.profileStatSection}>
							<Text style={styles.profileStatCount}>{this.props.data.core.member.followerCount}</Text>
							<Text style={styles.profileStatTitle}>Followers</Text>
						</View>
					</View>
					<View style={styles.profileTabBar}>
						<ScrollableTabView tabBarTextStyle={styles.tabBarText} tabBarBackgroundColor='#fff' tabBarActiveTextColor='#2080A7' tabBarUnderlineStyle={styles.activeTabUnderline} renderTabBar={() => <ScrollableTabBar />}>
							<View tabLabel='PROFILE'>
								<SectionList 
									renderItem={({item}) => <ListItem key={item.key} data={item.data} />} 
									renderSectionHeader={({section}) => <SectionHeader title={section.title} />}
									sections={ customFields }
								/>
							</View>
							<View tabLabel='CONTENT'>
								<Text>Ridiculus</Text>
							</View>
							<View tabLabel='ABOUT ME'>
								<Text>Mattis</Text>
							</View>
							<View tabLabel='FOLLOWERS'>
								<Text>Ridiculus</Text>
							</View>
						</ScrollableTabView>
					</View>
				</ScrollView>
			);
		}
	}
}

const styles = StyleSheet.create({
	profileHeader: {
		height: 230
	},
	profileHeaderInner: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: 230,
		paddingTop: 40,
		backgroundColor: 'rgba(49,68,83,0.2)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	coverPhoto: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: 230,
		backgroundColor: '#f0f0f0'
	},
	usernameText: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		marginTop: 7,
		textShadowColor: 'rgba(0,0,0,0.4)',
		textShadowOffset: { width: 1, height: 1 }
	},
	groupText: {
		color: '#fff',
		fontSize: 15,
		textShadowColor: 'rgba(0,0,0,0.4)',
		textShadowOffset: { width: 1, height: 1 }
	},
	profileStats: {
		backgroundColor: '#171717',
		paddingTop: 10,
		paddingBottom: 10,
		display: 'flex',
		flexDirection: 'row'
	},
	profileStatSection: {
		flex: 1,
	},
	profileStatSectionBorder: {
		borderRightWidth: 1,
		borderRightColor: 'rgba(255,255,255,0.1)'
	},
	profileStatCount: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 17,
		fontWeight: '500'
	},
	profileStatTitle: {
		color: '#8F8F8F',
		fontSize: 11,
		textAlign: 'center'
	},
	tabBarText: {
		fontWeight: 'bold',
		fontSize: 13
	},
	activeTabUnderline: {
		backgroundColor: '#2080A7',
		height: 2
	}
});

export default graphql( ProfileQuery, {
	options: (props) => ({
        variables: { 
        	member: props.navigation.state.params.id,
        }
    })
} )( ProfileScreen );
