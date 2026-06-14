import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    FolderKanban,
    Github,
    Globe2,
    Link2,
    MessageCircle,
    Network,
    UserRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/admin/portfolio',
        icon: BriefcaseBusiness,
    },
    {
        title: 'Hero',
        href: '/admin/hero',
        icon: UserRound,
    },
    {
        title: 'Projects',
        href: '/admin/projects',
        icon: FolderKanban,
    },
    {
        title: 'Capability Map',
        href: '/admin/capability-map',
        icon: Network,
    },
    {
        title: 'Experience',
        href: '/admin/experience',
        icon: BriefcaseBusiness,
    },
    {
        title: 'Links & Contact',
        href: '/admin/contact',
        icon: Link2,
    },
    {
        title: 'Inbox',
        href: '/admin/inbox',
        icon: MessageCircle,
    },
    {
        title: 'View Website',
        href: '/',
        icon: Globe2,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'GitHub Profile',
        href: 'https://github.com/mx-dln',
        icon: Github,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/portfolio" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
