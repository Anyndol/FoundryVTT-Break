export const RANK_XP = [0,6,12,24,36,48,72,96,132,168]

const BREAK = {}

BREAK.ability_types = {
    calling: "BREAK.Calling",
    species: "BREAK.Species",
    weapon: "BREAK.Weapon",
    armor: "BREAK.Armor"
}

BREAK.languages = {
    high_akenian: "BREAK.LANGUAGES.High_Akenian",
    dark_tongue: "BREAK.LANGUAGES.Dark_Tongue",
    dream_call: "BREAK.LANGUAGES.Dream_Call",
    fade_song: "BREAK.LANGUAGES.Fade_Song",
    glysian_code: "BREAK.LANGUAGES.Glysian_Code",
    bright_speech: "BREAK.LANGUAGES.Bright_Speech",
    hoshi_ban: "BREAK.LANGUAGES.Hoshi_Ban",
    under_warble: "BREAK.LANGUAGES.Under_Warble",
    creators_script: "BREAK.LANGUAGES.Creators_Script"
}

BREAK.callings = {
    select: {
        label: "BREAK.Select",
        stats: {
            might: 0,
            deftness: 0,
            grit: 0,
            insight: 0,
            aura: 0,
            attack: 0,
            defense: 0,
            hearts: 0,
            speed: 0
        },
        abilities: []
    },
    factotum: {
        label: "BREAK.CALLING.Factotum",
        stats: {
            might: 7,
            deftness: 9,
            grit: 8,
            insight: 9,
            aura: 9,
            attack: 0,
            defense: 10,
            hearts: 2,
            speed: 1
        },
        abilities: [
            "second_to_none",
            "factotum_pack",
            "dont_mind_me"
        ]
    },
    sneak: {
        label: "BREAK.CALLING.Sneak",
        stats: {
            might: 7,
            deftness: 10,
            grit: 7,
            insight: 10,
            aura: 8,
            attack: 0,
            defense: 10,
            hearts: 2,
            speed: 1
        },
        abilities: [
            "light_footed",
            "furtive",
            "sticky_fingers"
        ]
    },
    champion: {
        label: "BREAK.CALLING.Champion",
        stats: {
            might: 10,
            deftness: 8,
            grit: 9,
            insight: 9,
            aura: 8,
            attack: 1,
            defense: 10,
            hearts: 3,
            speed: 1
        },
        abilities: [
            "combat_momentum",
            "favored_weapon",
            "into_the_fray"
        ]
    },
    raider: {
        label: "BREAK.CALLING.Raider",
        stats: {
            might: 9,
            deftness: 9,
            grit: 9,
            insight: 8,
            aura: 7,
            attack: 1,
            defense: 10,
            hearts: 3,
            speed: 2
        },
        abilities: [
            "like_the_wind",
            "hunters_focus",
            "sidestep"
        ]
    },
    battle_princess: {
        label: "BREAK.CALLING.Battle_Princess",
        stats: {
            might: 8,
            deftness: 8,
            grit: 9,
            insight: 7,
            aura: 10,
            attack: 1,
            defense: 10,
            hearts: 3,
            speed: 1
        },
        abilities: [
            "hearts_blade",
            "shield_of_love",
            "soul_companion"
        ]
    },
    murder_princess: {
        label: "BREAK.CALLING.Murder_Princess",
        stats: {
            might: 8,
            deftness: 7,
            grit: 10,
            insight: 8,
            aura: 9,
            attack: 1,
            defense: 10,
            hearts: 3,
            speed: 1
        },
        abilities: [
            "wraths_blade",
            "withering_glare",
            "tenacity"
        ]
    },
    sage: {
        label: "BREAK.CALLING.Sage",
        stats: {
            might: 6,
            deftness: 8,
            grit: 8,
            insight: 10,
            aura: 8,
            attack: 0,
            defense: 10,
            hearts: 2,
            speed: 1
        },
        abilities: [
            "grand_grimoire",
            "sages_staff",
            "prestidigitonium"
        ]
    },
    heretic: {
        label: "BREAK.CALLING.Heretic",
        stats: {
            might: 7,
            deftness: 7,
            grit: 10,
            insight: 7,
            aura: 9,
            attack: 0,
            defense: 10,
            hearts: 2,
            speed: 1
        },
        abilities: [
            "fitful_sleep",
            "dreadful",
            "squire_marlow"
        ]
    }
}

BREAK.species = {
    select: {
        label: "BREAK.Select",
        size: "medium",
        innate_abilities: [],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    human_native: {
        label: "BREAK.SPECIES.Human_Native",
        size: "medium",
        innate_abilities: ["prodigy"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    human_stray: {
        label: "BREAK.SPECIES.Human_Dimensional_Stray",
        size: "medium",
        innate_abilities: ["leisurely_focus"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    chib: {
        label: "BREAK.SPECIES.Chib",
        size: "small",
        innate_abilities: ["easily_overlooked"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    tenebrate: {
        label: "BREAK.SPECIES.Tenebrate",
        size: "medium",
        innate_abilities: ["night_born", "shadow_sight"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    rai_neko: {
        label: "BREAK.SPECIES.Rai_Neko",
        size: "medium",
        innate_abilities: ["oldtech_proficiency", "hunters_blood"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    promethean: {
        label: "BREAK.SPECIES.Promethean",
        size: "large",
        innate_abilities: ["cryptic_heritage", "born_of_the_sun"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    gruun: {
        label: "BREAK.SPECIES.Gruun",
        size: "large",
        innate_abilities: ["as_tough_as_you_look"],
        maturative_abilities: [],
        quirk_table: "inheritor"
    },
    goblin: {
        label: "BREAK.SPECIES.Goblin",
        size: "small",
        innate_abilities: ["under_dweller", "gobbo_werks"],
        maturative_abilities: [],
        quirk_table: "old_world"
    },
    dwarf: {
        label: "BREAK.SPECIES.Dwarf",
        size: "medium",
        innate_abilities: ["under_dweller", "sturdy"],
        maturative_abilities: [],
        quirk_table: "old_world"
    },
    elf: {
        label: "BREAK.SPECIES.Elf",
        size: "medium",
        innate_abilities: ["ageless", "immortal_ego"],
        maturative_abilities: [],
        quirk_table: "old_world"
    },
    bio_mechanoid: {
        label: "BREAK.SPECIES.Bio_Mechanoid",
        size: "medium",
        innate_abilities: ["not_flesh_and_blood", "personal_analytics"],
        maturative_abilities: [],
        quirk_table: "bio_mechanoid"
    }
}

BREAK.sizes = {
    small: {
        label: "BREAK.SPECIES.SIZE.Small",
        might: -1,
        deftness: 1,
        defense: 1,
        inventory: 8,
        melee_restrictions: [],
        armor_restrictions: [],
        shield_restrictions: [],
        missile_restrictions: []
    },
    medium: {
        label: "BREAK.SPECIES.SIZE.Medium",
        might: 0,
        deftness: 0,
        defense: 0,
        inventory: 10,
        melee_restrictions: [],
        armor_restrictions: [],
        shield_restrictions: [],
        missile_restrictions: []
    },
    large: {
        label: "BREAK.SPECIES.SIZE.Large",
        might: 1,
        deftness: 0,
        defense: -1,
        inventory: 12,
        melee_restrictions: [],
        armor_restrictions: [],
        shield_restrictions: [],
        missile_restrictions: []
    }
}

BREAK.homelands = {
    select: {
        label: "BREAK.Select",
        bonus_languages: [],
        histories: {
            select: {
                type: "outcast",
                label: "BREAK.Select"
            }
        }
    },
    wistful_dark: {
        label: "BREAK.HOMELAND.Wistful_Dark",
        bonus_languages: [
            "high_akenian",
            "dark_tongue",
            "dream_call"
        ],
        histories: {
            select: {
                type: "outcast",
                label: "BREAK.Select"
            },
            forsaken_wanderer: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Forsaken_Wanderer",
                purviews: [],
                starting_gear: {}
            },
            blight_raider: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Blight_Raider",
                purviews: [],
                starting_gear: {}
            },
            shadow_lands_nomad: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Shadow_Lands_Nomad",
                purviews: [],
                starting_gear: {}
            },
            murk_dweller: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Murk_Dweller",
                purviews: [],
                starting_gear: {}
            },
            nightwall_yeoman: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Nightwall_Yeoman",
                purviews: [],
                starting_gear: {}
            },
            starlight_farmer: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Starlight_Farmer",
                purviews: [],
                starting_gear: {}
            },
            guild_agent: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Guild_Agent",
                purviews: [],
                starting_gear: {}
            },
            town_guard: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Town_Guard",
                purviews: [],
                starting_gear: {}
            },
            celebrated_artist: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Celebrated_Artist",
                purviews: [],
                starting_gear: {}
            },
            magia_university_graduate: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Magia_University_Graduate",
                purviews: [],
                starting_gear: {}
            },
            knight_errant: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Knight_Errant",
                purviews: [],
                starting_gear: {}
            },
            shard_state_patrician: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.WISTFUL_DARK.Shard_State_Patrician",
                purviews: [],
                starting_gear: {}
            }
        }
    },
    twilight_meridian: {
        label: "BREAK.HOMELAND.Twilight_Meridian",
        bonus_languages: [
            "fade_song",
            "dark_tongue",
            "gleysian_code"
        ],
        histories: {
            select: {
                type: "outcast",
                label: "BREAK.Select"
            },
            disgraced_scion: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Disgraced_Scion",
                purviews: [],
                starting_gear: {}
            },
            shadow_sea_pirate: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Shadow_Sea_Pirate",
                purviews: [],
                starting_gear: {}
            },
            orphaned_shinobi: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Orphaned_Shinobi",
                purviews: [],
                starting_gear: {}
            },
            oldtech_junker: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Oldtech_Junker",
                purviews: [],
                starting_gear: {}
            },
            twilight_silk_tailor: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Twilight_Silk_Tailor",
                purviews: [],
                starting_gear: {}
            },
            medicine_peddler: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Medicine_Peddler",
                purviews: [],
                starting_gear: {}
            },
            shining_sea_fisherman: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Shining_Sea_Fisherman",
                purviews: [],
                starting_gear: {}
            },
            portian_university_graduate: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Portian_University_Graduate",
                purviews: [],
                starting_gear: {}
            },
            merchant_scion: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Merchant_Scion",
                purviews: [],
                starting_gear: {}
            },
            holy_isle_samurai: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Holy_Isle_Samurai",
                purviews: [],
                starting_gear: {}
            },
            archive_researcher: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Archive_Researcher",
                purviews: [],
                starting_gear: {}
            },
            black_glove_cavalier: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.TWILIGHT_MERIDIAN.Black_Glove_Cavalier",
                purviews: [],
                starting_gear: {}
            }
        }
    },
    blazing_garden: {
        label: "BREAK.HOMELAND.Blazing_Garden",
        bonus_languages: [
            "bright_speech",
            "hoshi_ban",
            "fade_song"
        ],
        histories: {
            select: {
                type: "outcast",
                label: "BREAK.Select"
            },
            kinless_vagrant: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Kinless_Vagrant",
                purviews: [],
                starting_gear: {}
            },
            monster_slayer: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Monster_Slayer",
                purviews: [],
                starting_gear: {}
            },
            street_rat: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Street_Rat",
                purviews: [],
                starting_gear: {}
            },
            thunda_clan_barbarian: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Thunda_Clan_Barbarian",
                purviews: [],
                starting_gear: {}
            },
            beast_handler: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Beast_Handler",
                purviews: [],
                starting_gear: {}
            },
            village_runner: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Village_Runner",
                purviews: [],
                starting_gear: {}
            },
            jubilant_performer: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Jubilant_Performer",
                purviews: [],
                starting_gear: {}
            },
            city_scrivener: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.City_Scrivener",
                purviews: [],
                starting_gear: {}
            },
            emissary_of_sol: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Emissary_Of_Sol",
                purviews: [],
                starting_gear: {}
            },
            wyrm_blooded: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Wyrm_Blooded",
                purviews: [],
                starting_gear: {}
            },
            hinterlands_noble: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Hinterlands_Noble",
                purviews: [],
                starting_gear: {}
            },
            startech_adept: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BLAZING_GARDEN.Startech_Adept",
                purviews: [],
                starting_gear: {}
            }
        }
    },
    buried_kingdom: {
        label: "BREAK.HOMELAND.Buried_Kingdom",
        bonus_languages: [
            "high_akenian",
            "under_warble",
            "creators_script"
        ],
        histories: {
            select: {
                type: "outcast",
                label: "BREAK.Select"
            },
            tunnel_crawler: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Tunnel_Crawler",
                purviews: [],
                starting_gear: {}
            },
            ruin_scavenger: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Ruin_Scavenger",
                purviews: [],
                starting_gear: {}
            },
            war_deserter: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.War_Deserter",
                purviews: [],
                starting_gear: {}
            },
            moss_scraper: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Moss_Scraper",
                purviews: [],
                starting_gear: {}
            },
            underland_soldier: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Underland_Soldier",
                purviews: [],
                starting_gear: {}
            },
            honored_laborer: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Honored_Laborer",
                purviews: [],
                starting_gear: {}
            },
            forge_hand: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Forge_Hand",
                purviews: [],
                starting_gear: {}
            },
            field_sapper: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Field_Sapper",
                purviews: [],
                starting_gear: {}
            },
            record_etcher: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Record_Etcher",
                purviews: [],
                starting_gear: {}
            },
            comrade_agitator: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Comrade_Agitator",
                purviews: [],
                starting_gear: {}
            },
            resolute_overseer: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Resolute_Overseer",
                purviews: [],
                starting_gear: {}
            },
            apprentice_thinker: {
                type: "elite",
                label: "BREAK.HOMELAND.HISTORY.BURIED_KINGDOM.Apprentice_Thinker",
                purviews: [],
                starting_gear: {}
            }
        }
    },
    other_world: {
        label: "BREAK.HOMELAND.Other_World",
        bonus_languages: [],
        histories: {
            select: {
                type: "outcast",
                label: "BREAK.Select"
            },
            transient: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Transient",
                purviews: [],
                starting_gear: {}
            },
            neet: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.NEET",
                purviews: [],
                starting_gear: {}
            },
            retail_servce: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Retail_Servce",
                purviews: [],
                starting_gear: {}
            },
            blue_collar: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Blue_Collar",
                purviews: [],
                starting_gear: {}
            },
            white_collar: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.White_Collar",
                purviews: [],
                starting_gear: {}
            },
            domestic: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Domestic",
                purviews: [],
                starting_gear: {}
            },
            military_law_enforcement: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Military_Law_Enforcement",
                purviews: [],
                starting_gear: {}
            },
            education_faculty: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Education_Faculty",
                purviews: [],
                starting_gear: {}
            },
            education_student: {
                type: "commoner",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Education_Student",
                purviews: [],
                starting_gear: {}
            },
            idle_rich: {
                type: "outcast",
                label: "BREAK.HOMELAND.HISTORY.OTHER_WORLD.Idle_Rich",
                purviews: [],
                starting_gear: {}
            }
        }
    }
}

// maybe redundant
BREAK.regions = {
    wistful_dark: {
        name: "BREAK.REGIONS.Wistful_Dark",
        languages: [
            "high_akenian",
            "dark_tongue",
            "dream_call"
        ]
    },
    twilight_meridian: {
        name: "BREAK.REGIONS.Wistful_Dark",
        languages: [
            "dark_tongue",
            "fade_song",
            "glysian_code"
        ]
    },
    blazing_garden: {
        name: "BREAK.REGIONS.Wistful_Dark",
        languages: [
            "bright_speech",
            "hoshi_ban",
            "fade_song"
        ]
    },
    buried_kingdom: {
        name: "BREAK.REGIONS.Wistful_Dark",
        languages: [
            "high_akenian",
            "under_warble",
            "creators_script"
        ]
    }
}

BREAK.menace_types = {
    mook: {
        label: "BREAK.MENACE.Mook"
    },
    boss: {
        label: "BREAK.MENACE.Boss"
    },
    mega_boss: {
        label: "BREAK.MENACE.Mega_Boss"
    },
    colossus: {
        label: "BREAK.MENACE.Colossus"
    }
}

export default BREAK;
