import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const AppDrawer = ({ children, description, open, onOpen, title }) => {
  return (
    <Drawer open={open}>
      <DrawerTrigger>{onOpen}</DrawerTrigger>
      <DrawerContent>
        <div className="container mx-auto flex flex-col items-center gap-2 pt-12 pb-12">
          <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
