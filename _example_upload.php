<?php
    
    require "/Users/Mark/Projects/ips.dev/init.php";
    
    /* Load content */
    $content = \IPS\forums\Topic\Post::load( 25 );
    $member = $content->author();
    
    /* Create file object and make it an attachment */
    $file = \IPS\File::create( 'core_Attachment', 'myattachment.png', NULL, NULL, FALSE, 'myattachment.png' ); // Can also use createFromUploads()
    $attachment = $file->makeAttachment( md5( uniqid() ), $member );
    
    /* Claim it to this content */
    if ( $content instanceof \IPS\Content\Item )
    {
        $locationKey = $content::$application . '_' . mb_ucfirst( $content::$module );
        $idColumn = $content::$databaseColumnId;
        $attachIds = array( $content->$idColumn );
    }
    else
    {
        $item = $content->item();
        $locationKey = $item::$application . '_' . mb_ucfirst( $item::$module );
        $attachIds = $content->attachmentIds();
    }    
    \IPS\Db::i()->insert( 'core_attachments_map', array(
        'attachment_id'    => $attachment['attach_id'],
        'location_key'    => $locationKey,
        'id1'            => ( isset( $attachIds[0] ) ) ? $attachIds[0] : NULL,
        'id2'            => ( isset( $attachIds[1] ) ) ? $attachIds[1] : NULL,
        'id3'            => ( isset( $attachIds[2] ) ) ? $attachIds[2] : NULL,
    ) );
    
    /* Add it into the body of the content */
    $value = $content->content();    
    $ext = mb_substr( $attachment['attach_file'], mb_strrpos( $attachment['attach_file'], '.' ) + 1 );
    if ( in_array( mb_strtolower( $ext ), \IPS\File::$videoExtensions ) )
    {
        $value .= \IPS\Theme::i()->getTemplate( 'editor', 'core', 'global' )->attachedVideo( $attachment['attach_location'], \IPS\Http\Url::baseUrl( \IPS\Http\Url::PROTOCOL_RELATIVE ) . "applications/core/interface/file/attachment.php?id=" . $attachment['attach_id'], $attachment['attach_file'], \IPS\File::getMimeType( $attachment['attach_file'] ), $attachment['attach_id'] );
    }
    elseif ( $attachment['attach_is_image'] )
    {
        $value .= \IPS\Theme::i()->getTemplate( 'editor', 'core', 'global' )->attachedImage( $attachment['attach_location'], $attachment['attach_thumb_location'] ? $attachment['attach_thumb_location'] : $attachment['attach_location'], $attachment['attach_file'], $attachment['attach_id'] );
    }
    else
    {
        $value .= \IPS\Theme::i()->getTemplate( 'editor', 'core', 'global' )->attachedFile( \IPS\Http\Url::baseUrl( \IPS\Http\Url::PROTOCOL_RELATIVE ) . "applications/core/interface/file/attachment.php?id=" . $attachment['attach_id'], $attachment['attach_file'] );
    }
    $contentColumn = $content::$databaseColumnMap['content'];
    $content->$contentColumn = $value;
    $content->save();