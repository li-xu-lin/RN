import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const LevelProgressBar = ({ 
    level = 1, 
    levelTitle = '初学者', 
    currentExp = 0, 
    progress = 0, 
    expNeeded = 100,
    style = {} 
}) => {
    return (
        <View style={[styles.container, style]}>
            {/* 等级标题区域 */}
            <View style={styles.levelHeader}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>Lv.{level}</Text>
                </View>
                <Text style={styles.levelTitle}>{levelTitle}</Text>
                <View style={styles.expInfo}>
                    <Text style={styles.expText}>{currentExp} EXP</Text>
                </View>
            </View>
            
            {/* 进度条区域 */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { width: `${Math.min(progress, 100)}%` }
                        ]} 
                    />

                </View>
                
                {/* 进度信息 */}
                <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>{progress}%</Text>
                    {level < 30 && (
                        <Text style={styles.expNeededText}>
                            还需 {expNeeded} 经验升级
                        </Text>
                    )}
                    {level >= 30 && (
                        <Text style={styles.maxLevelText}>
                            ✨ 已达最高等级 ✨
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#FF6B9D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 157, 0.1)', // 淡粉色边框
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    levelBadge: {
        backgroundColor: 'linear-gradient(45deg, #FF6B9D, #8B5CF6)',
        backgroundColor: '#FF6B9D', // 粉紫色，更适合女性用户
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 12,
        shadowColor: '#FF6B9D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    levelText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
    },
    expInfo: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    expText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    progressContainer: {
        marginTop: 5,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF6B9D', // 粉色进度条
        borderRadius: 4,
        position: 'relative',
        shadowColor: '#FF6B9D',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },

    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF6B9D',
    },
    expNeededText: {
        fontSize: 12,
        color: '#6B7280',
    },
    maxLevelText: {
        fontSize: 12,
        color: '#F59E0B',
        fontWeight: 'bold',
    },
});

export default LevelProgressBar; 