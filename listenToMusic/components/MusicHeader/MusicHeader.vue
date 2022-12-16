<template>
	<view class ="music-header" :style="{color:color}">
		<view class="music-header-icon" v-if="icon" :class="{'music-header-black':iconblack}">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack"></text> | <text class="iconfont icon-shouye" @tap="handleToHome"></text>	
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		name:"MusicHeader",
		data() {
			return {
				
			};
		},
		props:['title','icon','color','iconblack'],
		methods:{
			handleToBack(){
				uni.navigateBack();
			},
			handleToHome(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped> 
	.music-header{
		width:100%;
		height:75px;
		font-size:16px;
		line-height:80px;
		text-align:center;
		color:black;
		position: relative;
	}
	.music-header-icon{
		position:absolute;
		left:8px;
		top:26px;
		width:90px;
		height: 31px;
		background-color: rgba(0,0,0,0.1);
		color:white;
		line-height:31px;
		border-radius: 15px;
		display:flex;
		justify-content: space-evenly;
	}
	.music-header-black{
		color:gray;
		border:1px solid black;
	}
</style>